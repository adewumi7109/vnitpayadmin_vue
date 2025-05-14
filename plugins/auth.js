import { useAppStore } from "~/stores/app";

export default defineNuxtPlugin(async (nuxtApp) => {
    const appStore = useAppStore();
    const runtimeConfig = useRuntimeConfig();
    const route = useRoute();
    // const { $get } = useNuxtApp();
    
    const router = useRouter();

    const baseUrl = runtimeConfig.public.apiBase;
    const clientUrl = runtimeConfig.public.CLIENT_URL;
    const isCookie = runtimeConfig.public.AUTH_TYPE.toLowerCase() === 'cookie';

    const tokenCode = "____VUT"
    const userCode = "____VUD"
    const token_cookie = useCookie(tokenCode);
    const user_cookie = useCookie(userCode);

    const encodeObject = (obj) => btoa(JSON.stringify(obj));

    const decodeObject = (encodedObj) => {
        try {
            return JSON.parse(atob(encodedObj));
        } catch (error) {
            return null;
        }
    };

    const getCookieValue = async (key) => {
            // console.log('GETTING COOKIES: ' + key);
            const cookie = useCookie(key);
            const decode = cookie.value ? decodeObject(cookie.value) : null;
            console.log(key, decode);
            return decode
    };

    const setCookieValue = async (key, value) => {
        const encodedValue = encodeObject(value);

        const cookie = useCookie(key);
        cookie.value = encodedValue;
    };

    const token = await getCookieValue(tokenCode);
    const user = await getCookieValue(userCode);
    appStore.setToken(token);
    appStore.setUser(user);

    (() => {
    console.log('CONFIG: ', {
        'ENVIRONMENT: ': runtimeConfig.public.ENVIRONMENT,
        'BASE: ': baseUrl,
        'TOKEN: ': token,
        'AUTHENTICATED: ': appStore.loggedIn,
        isCookie,
    });
    })();


    const setUserAndToken = async (newUser, newToken = appStore.token) => {
        appStore.setUser(newUser);
        appStore.setToken(newToken);

        await setCookieValue(userCode, newUser); // Store user data
        await setCookieValue(tokenCode, newToken); // Store token
    };

    const getUser = async () => {
        return new Promise((resolve, reject) => {
            console.log('getUser: ', appStore.token);
            $fetch(`${baseUrl}auth/user`, {
                method: 'GET',
                headers: { 
                    Authorization: `Bearer ${appStore.token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(data => {
                setUserAndToken(data.data);
                if(['login'].includes(route.name.toLowerCase())){
                    navigateTo({ path: 'dashboard' });
                }
                resolve(data);
            })
            .catch(error => {
                console.log("ERORRR: ", error);
                // Check if it's a network error (No response OR failed request due to lost internet)
                if (!error.response || error.message.includes("Network Error")) {
                    appStore.internetError = true;
                    console.warn("Network error: Please check your internet connection.");
                    resolve("Network error");
                }
            
                console.error("------------------- ERROR START -----------------------");
                console.error("ERROR STATUS:", error.response.status);
                console.error("ERROR RESPONSE:", error.response);
                console.error("------------------- ERROR END -----------------------");
            
                const { status, data } = error.response;
            
                if (status === 400 && data) {
                    if (data.message) {
                        reject(data.message);
                    }

                    const errors = data.errors || [];
                    if (errors.length) {
                        errors.forEach(errorArray => console.log(errorArray[0]));
                    }

                } 
                else if (status === 401) {
                    console.log("Unauthorized");
                    logoutUser();
                } 
                else if (status === 403) {
                    router.push("/dashboard");
                } 
                else if (status === 404) {
                    router.push("/404");
                }
                else if (status >= 500) {
                    // throw createError({ statusCode: 500, message: "API Error Occurred" });
                    reject(error)
                }

                reject("An Error Occurred");
            });
        });
    };

    const logoutUser = async (redirect) => {
        console.log("-------------------------------- LOG OUT");
        token_cookie.value = null;
        user_cookie.value = null;

        await Preferences.remove({ key: '__EUT' });
        await Preferences.remove({ key: '__EUD' });

        appStore.LogOut();

        $fetch(`${baseUrl}auth/logout`, {
            method: 'POST'
        })
        .catch(() => console.log("ERRORS"));

        navigateTo({ path: redirect ? `/exams` : `/exams` });
    };

    const loginUser = (payload) => {
        return new Promise((resolve, reject) => {
            $fetch(`${baseUrl}auth/login`, {
                method: 'POST',
                body: {
                    email: payload.email,
                    password: payload.password,
                }
            })
                .then(data => {
                    setTimeout(async() => {
                        console.log("Setting user and token:", data);
                        setUserAndToken(data.data.userData, data.data.auth.accessToken);
                        resolve(data.data.userData);
                    }, 500);
                })
                .catch(error => {
                    handleFetchError(error, reject);
                });
        });
    };

    const registerUser = (payload) => {
        return new Promise((resolve, reject) => {
            console.log("Registering user:", payload);
            $fetch(`${baseUrl}auth/register`, {
                method: 'POST',
                body: {
                    ...payload, 
                    comfirmPassword: payload.password,
                }
            })
                .then(data => {
                    setTimeout(async() => {
                        setUserAndToken(data.data.user, data.data.accessToken);
                        resolve(data.user);
                    }, 500);
                })
                .catch(error => {
                    handleFetchError(error, reject);
                });
        });
    };

    const externalLogin = (payload) => {
        return new Promise((resolve, reject) => {
            payload.isCookie = isCookie;

            $fetch(`${baseUrl}auth/external`, {
                method: 'POST',
                body: payload
            })
                .then(data => {
                    setTimeout(async() => {
                        console.log("Setting user and token (external):", data.data.user, data.data.accessToken);
                        setUserAndToken(data.data.user, data.data.accessToken);
                        resolve(data.data);
                    }, 100);
                })
                .catch(error => {
                    setTimeout(() => {
                        console.error("Error in external login:", error);
                        handleFetchError(error, reject);
                    }, 500);
                });
        });
    };

    const handleFetchError = (error, reject) => {
        console.log("--------------AUTH ERROR DATA START-----------------");
        console.log("ERROR DATA", error.response._data);
        console.log("--------------AUTH ERROR DATA END-----------------");

        const { status, _data } = error.response;

        if (status >= 500) {
            // console.log("--------------SERVER ERROR-----------------");
            reject("An error occurred, please try again");
        } else {
            // console.error("Fetch Error:", error);
            reject(error.response._data || "Bad Request");
        }
    };

    // Fetch user data on page refresh (client-side only)
    if (!import.meta.env.SSR && token) {
        await getUser();
    }else{
        console.log("Won't getUser")
    }

    return {
        provide: {
            loginUser,
            logoutUser,
            registerUser,
            externalLogin,
            setUserAndToken,
            getUser
        }
    };
});
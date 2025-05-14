import { useAppStore } from "~/stores/app";

export default defineNuxtPlugin(async (nuxtApp) => {
     const appStore = useAppStore();
    const runtimeConfig = useRuntimeConfig();
    const baseUrl = runtimeConfig.public.apiBase;
    const isCookie = runtimeConfig.public.AUTH_TYPE.toLowerCase() === 'cookie';
    const router = useRouter();

    const handleError = (url, error) => {
        const { $logoutUser } = useNuxtApp();

        console.error(error);
    
        // Check if it's a network error (No response OR failed request due to lost internet)
        if (!error.response || error.message.includes("Network Error")) {
            appStore.internetError = true;
            console.warn("Network error: Please check your internet connection.");
            return "Network error";
        }
    
        console.error("------------------- ERROR START -----------------------");
        console.error("ERROR STATUS:", error.response.status);
        console.error("ERROR URL:", url);
        console.error("ERROR RESPONSE:", error.response);
        console.error("------------------- ERROR END -----------------------");
    
        const { status, _data } = error.response;
    
        // if (status <= 400) {
        //     if (data.message) {
        //         return data.message;
        //     }
        //     const errors = data?.errors || [];
        //     if (errors.length) {
        //         errors.forEach(errorArray => console.log(errorArray[0]));
        //     }
        // } else if (status === 401) {
        //     console.log("Unauthorized");
        //     // $logoutUser();
        // } else if (status === 403) {
        //     router.push("/403");
        // } else if (status === 404) {
        //     router.push("/404");
        // } else if (status >= 500) {
        //     reject(error)
        //     // throw createError({ statusCode: 500, message: "API Error Occurred" });
        // }

        console.log(error.response)
        console.log({ status, _data })

        if (_data.message) {
            return _data.message
        }
        const errors = _data?.errors || [];
        if (errors.length) {
            errors.forEach(errorArray => console.log(errorArray[0]));
            return errors
        }
    
        return error
    };

    const addAuthHeader = (type = null) => {
        const headers = {
          Authorization: `Bearer ${appStore.token}`, // Always include the token
          "X-Platform": appStore?.platForm ?? "all"
        };
      
        if (type) {
          headers["Content-Type"] = type; // Add Content-Type if explicitly provided
        }
      
        return headers;
    };

    const request = (url, config) => {
        return new Promise((resolve, reject) => {
            console.info(`-----NEW ${config.method} REQUEST START URL: /${url}-----`);
            if (isCookie)
                config.credentials = 'include';

            $fetch(baseUrl + url, config)
                .then(data => {
                    console.info("REQUEST RESPOPNSE:", data);
                    resolve(data)
                })
                .catch(error => setTimeout(() => reject(handleError(url, error)), 200));
        });
    };

    const get = (url, params) => request(url, {
        method: "GET",
        headers: addAuthHeader("application/json"), // Explicitly set 'Content-Type'
        params,
    });

    const post = (url, body) => request(url, {
        method: "POST",
        body,
        headers: addAuthHeader("application/json"), // Explicitly set 'Content-Type'
    });

    const put = (url, body) => request(url, {
        method: "PUT",
        body,
        headers: addAuthHeader("application/json"), // Explicitly set 'Content-Type'
    });

    const upload = (url, formData) => request(url, {
        method: "PUT",
        body:formData,
        headers: addAuthHeader(),
    });

    const deleteM = (url) => request(url, {
        method: "DELETE",
        headers: addAuthHeader("application/json"), // Explicitly set 'Content-Type'
    });

    return {
        provide: {
            get,
            post,
            put,
            upload,
            delete: deleteM,
        }
    };
});

import {useAppStore} from "~/stores/app"

export default defineNuxtRouteMiddleware((to, from) => {
    const appStore = useAppStore()
    // console.log("MW: ", to)
    // console.log("USER: ",appStore.user)

    if (to.name == 'login' && appStore.loggedIn)
        return navigateTo({ path: 'dashboard' })

    else if(to.name != 'login' && !appStore.loggedIn){
            return navigateTo(`/login?redirect=${to.name.toLowerCase()}`)
    }
    // else{
    //     if(to.name){
    //         if((to.name.includes('login') || to.name.includes('register')) && appStore.loggedIn)
    //          return navigateTo({ path: 'dashboard' })
    //     }
    // }
})
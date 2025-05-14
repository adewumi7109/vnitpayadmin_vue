import { defineStore } from "pinia";

export const useAppStore = defineStore("appStore",{

    state:() => {
        return{
            appname:"Vnitpay",
            user:{firstName:'', lastName:''},
            token: null,

            platForm: 'NONE',
        }
    },


    getters:{
        getUser: state => state.user || null,
        getName: state => state.user.firstName || "",
        getFullName: state => state.user ? `${state.user.firstName} ${state.user.lastName}` : "",
        loggedIn: state => state.token !== null,
    },

    actions:{
        setToken(payload){
            this.token = payload
        },

        setUser(payload){
            this.user = payload
        },
        
        LogOut(){
            this.user = null
            this.token = null
        }
    }
})
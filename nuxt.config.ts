// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  components: [{ path: "~/components", pathPrefix: false }],

  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/fonts",
    // '@nuxtjs/tailwindcss',// 'nuxt-vue3-google-signin'
    "@nuxt/content",
    "shadcn-nuxt",
    "@pinia/nuxt",
  ],

  css: ["~/assets/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },

  // googleSignIn: {
  //   clientId: '',
  // }

  runtimeConfig:{
    app:{
      name: 'Vnitpay-Admin',
      version: '1.0.0',
      description: '',
    },

    public: {
      ENVIRONMENT: 'Development',
      apiBase: 'https://test.vnitpay.com.ng/api/',
      AUTH_TYPE: 'jwt',
      CLIENT_URL:"",
      GOOGLE_CLIENTID:"",
    }
  },
});

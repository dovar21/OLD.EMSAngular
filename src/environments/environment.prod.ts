export const environment = {
    production: true,
    hmr: false,
    JWT: {
        whitelistedDomains: ['samr.evomedia.pro'],
        blacklistedRoutes: ['samr.evomedia.pro/auth']
    },
    API: {
        URL: `http://u0901520.plsk.regruhosting.ru/api/v1/`,
        LOGIN: `http://u0901520.plsk.regruhosting.ru/api/v1/Auth/Login`,
        REFRESH_TOKEN: `http://u0901520.plsk.regruhosting.ru/api/v1/Account/RefreshToken`,
        SIGNALR: `http://u0901520.plsk.regruhosting.ru/hubs/`
    }
};

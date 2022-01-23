export const environment = {
    production: false,
    hmr: true,
    JWT: {
        whitelistedDomains: ['localhost:4200', 'samrdev.evomedia.pro'],
        blacklistedRoutes: ['localhost:4200/auth', 'samrdev.evomedia.pro/auth']
    },
    API: {
        URL: `http://91.218.163.60\:89/api/`,
        LOGIN: `http://91.218.163.60\:89/api/Auth/Login`,
        REFRESH_TOKEN: `http://91.218.163.60\:89/api/Auth/RefreshToken`,
        SIGNALR: `http://91.218.163.60\:89/hubs/`
    }
};

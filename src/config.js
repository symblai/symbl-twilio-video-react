const config = {
    symbl: {
        appId: localStorage.getItem('symblAppId') || '',
        appSecret: localStorage.getItem('symblAppSecret') || ''
    },
    appBasePath: "/" // Set this to something else if you want to deploy multiple versions on same server. Always end with /
};
export default config;
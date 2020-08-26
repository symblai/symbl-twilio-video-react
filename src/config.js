const config = {
    symbl: {
        appId: localStorage.getItem('symblAppId') || '',
        appSecret: localStorage.getItem('symblAppSecret') || ''
    }
};
export default config;
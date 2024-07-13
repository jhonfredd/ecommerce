
const apiUrl = 'http://localhost:4402/api';

export const ApiEndpoint = {
    Auth:{
        Register: `${apiUrl}/users/register`,
        Login: `${apiUrl}/users/login`,
        Me: `${apiUrl}/users/me`,
        CambioPassword: `${apiUrl}/users/cambioPassword`,
        //dasboard
        RegisterDasboards: `${apiUrl}/dasboard/registerDasboards`,
        getDasboards: `${apiUrl}/dasboard/getDasboards`,
        updateDasboards: `${apiUrl}/dasboard/updateDasboards`,
        updateStatusDasboards: `${apiUrl}/dasboard/updateStatusDasboards`,
    }
}

export const LocalStorage = {
    token: 'USER_TOKEN',
}
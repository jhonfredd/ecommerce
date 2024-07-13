export interface User{
    _id: string;
    first_name: string;
    last_name: string;
    name: string;
    telephone: number;
    email: string;
}

export interface ApiResponse<T>{
    status?: boolean;
    message?: string;
    error?: string;
    token?: string;
    data: T;
}

export interface LoginPayload{
    email: string;
    password: string;
}

export interface RegisterPayload {
    fist_name: string;
    last_name: string;
    telephone: number;
    email: string;
    password: string;
}

export interface CambiarPasswordPayload{//toca crear los modelos para las rutas
    _id: string;
    password: string;
    password2: string;
}

//dasBoards crear las coneciones de los modelos

export interface Dasboard{
    _id: string;
    title: string;
    sub_title: string;
    description: string;
    price: number;
    status: number;
}

export interface DasboardRegisterPayloade{
    title: string;
    sub_title: string;
    description: string;
    price: number;
    status: number;
}

export interface DasboardUpdate{
    _id:string;
    title: string;
    sub_title: string;
    description: string;
    price: number;
    status: number;
}

export interface UpdateStatus{
    id:string;
    status: number;
}



//dasboard fin

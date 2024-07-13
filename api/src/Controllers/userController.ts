import { NextFunction, Request, Response } from "express";
import userSchema from "../Schemas/userSchema";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import config from "../config/config";
import { AuthRequest } from "../middlewares/authenticate";

const me = async (req: Request, res: Response, next:NextFunction ) =>{
    // res.json({message: 'me function'})//mensaje inicail para saber si la api funciona
    const _request = req as AuthRequest;

    const user = await userSchema.findById(_request.userId);
    if(user){
        let usuario_name = user.first_name.split(' ')[0] +' '+ user.last_name.split(' ')[0];

        return res.status(200).json({
            status: true,
            message: "",
            data:{_id: user.id, email: user.email, name: usuario_name, first_name: user.first_name, last_name: user.last_name, telephone: user.telephone},
        })
    }

    return res.status(500).json({error: "Algo salió mal"})
}

const register = async (req: Request, res: Response, next:NextFunction ) =>{
    // res.json({message: 'register'}) // mensaje predefinido para la api
    const {first_name, last_name, telephone,email, password} = req.body;

    if(!first_name ||  !last_name || !telephone || !email || !password){
        return res.status(404).json({error: "Todos los campos son obligatorios"});
    }

    const user = await userSchema.findOne({email, telephone});
    if(user){
        return res.status(404).json({error: "El usuario ya existe."});
    }else if(telephone){
        return res.status(404).json({error: "El Telefono ya existe."});
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await userSchema.create({
            first_name,
            last_name,
            telephone,
            email,
            password: hashedPassword
        })

        res.status(200).json({
            status: true,
            message: "Usuario creado",
            data: {_id: newUser._id, first_name: newUser.first_name, last_name: newUser.last_name, telephone: newUser.telephone, email: newUser.email, password :newUser.password}
        });
    } catch (error) {
        return res.status(500).json({error,errors: 'Algo salió mal'});
    }
}

const login = async (req: Request, res: Response, next:NextFunction ) =>{
    // res.json({message: 'login'}) // mensaje predefinido para la api
    const {email, password} = req.body; //recibimos del body las credenciales y el usuario para validar el login

    if(!email || !password){
        return res.status(404).json({error: "Todos los campos son obligatorios"})
    }

    const user = await userSchema.findOne({email}); // validamos las credenciales que si existan
    if(!user){
        return res.status(404).json({error:"Usuario no encontrado."})
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password); //comparamos las credenciales

    if(!isPasswordMatch){
        return res.status(404).json({error: "Credenciales Incorrectas."});
    }

    try {
        const token = sign({sub: user._id}, config.jwtSecret as string,{
            expiresIn: '1d'
        }); // creamos el token para la session

        return res.status(200).json({
            status: true,
            message: "User loggedin",
            data:{_id: user.id, email: user.email, name: user.first_name +' '+ user.last_name},
            token

        })
    } catch (error) {
        return res.status(500).json({error: "Algo salió mal"});
    }

}

const cambioPassword = async (req: Request, res: Response, next:NextFunction) =>{
    const {_id, password} = req.body;
    try {
        const hashedPaswword = await bcrypt.hash(password, 12);
        const updatePassword = await userSchema.findByIdAndUpdate(
            _id,
            {password: hashedPaswword },
            {new: true}
        );

        return res.status(200).json({
            status: true,
            message: 'La contraseña se ha actualizado',
            data: updatePassword
        })

    } catch (error) {
        return res.status(500).json({error: 'Ocurrio un error, intenta mas tarde.'});
    }
}



export { me, register, login, cambioPassword} //retorna las rutas creadas
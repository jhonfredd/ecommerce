import {  Request, Response, NextFunction } from "express";
import config from "../config/config";
import { verify } from "jsonwebtoken";

export interface AuthRequest extends Request{
    userId: string;

}

const authenticate = (req: Request, res: Response, next: NextFunction) =>{
    const token = req.header('Authorization');
    
    if(!token){
        return res.status(401).json({message: "Authorization token is required"})
    }

    try {
        const parsedText = token.split(" ")[1];
        const decoded = verify(parsedText, config.jwtSecret as string);
        const _request = req as AuthRequest;

        _request.userId = decoded.sub as string;

       return next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized"})
    }
}

export default authenticate;
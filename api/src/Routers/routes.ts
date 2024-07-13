import express from "express";
import { cambioPassword, login, me, register } from "../Controllers/userController";
import authenticate from "../middlewares/authenticate";
import { cambioEstadoDasboard, getDasboard, registerDasboards, updateDasboard } from "../Controllers/dasboardController";

const Router  = express.Router();

Router.post('/users/register', register);
Router.post('/users/login',login);
Router.get('/users/me', authenticate, me);
Router.post('/users/cambioPassword', authenticate, cambioPassword);
Router.post('/dasboard/registerDasboards', authenticate, registerDasboards);
Router.get('/dasboard/getDasboards', getDasboard);//ser la misma ruta que src/app/constants
Router.post('/dasboard/updateDasboards', updateDasboard);//ser la misma ruta que src/app/constants
Router.post('/dasboard/updateStatusDasboards', cambioEstadoDasboard);//ser la misma ruta que src/app/constants

export default Router;
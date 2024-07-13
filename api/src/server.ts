import  express from "express";
import config  from "./config/config";
import webRouters from "./Routers/routes";
import db from "./config/db";
import cors from "cors";
import UserSeed from "./Seeders/UserSeed";

const app = express();
app.use(express.json());
app.use(cors());
// db(); //conectamos a la db de mongo

db().then(UserSeed);//conectamos a la db de mmanejamos seeder

app.use('/api', webRouters);//usamos la api en la cual creamos las rutas webs.

// app.get("/",(req, res)=>{
//     res.json({message: 'aplications is working fine.' });
// })

app.listen(config.port, ()=>{
    console.log(`Server is runnig on port: ${config.port}`)
})

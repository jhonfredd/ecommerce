import mongoose from 'mongoose' 
import config from './config'

const db = async () => {
    await mongoose.connect(config.mongoUrl as string).then(()=>{
        console.log("Database connected successfully");
    }).catch((error)=>{
        console.error("Error connecting to mongo Database:",error);
    })
}

export default db;
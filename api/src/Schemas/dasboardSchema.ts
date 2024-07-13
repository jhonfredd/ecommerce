import mongoose from "mongoose";
import { dasboard } from "../Types/dasboardTypes";

const UserSchema = new mongoose.Schema<dasboard>({
    title:{
        type: String,
        required: true,
    },
    sub_title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        required: true,
    },
    status:{
        type: Number,
        required: true,
    },
}, {timestamps : true}
);

export default mongoose.model<dasboard>('dasboard', UserSchema);//cambiar nombre
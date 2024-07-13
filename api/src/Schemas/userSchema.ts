import mongoose from "mongoose";
import { user } from "../Types/userTypes";

const UserSchema = new mongoose.Schema<user>({
    first_name:{
        type: String,
        required: true,
    },
    last_name:{
        type: String,
        required: true,
    },
    telephone:{
        type: Number,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
}, {timestamps : true}
);

export default mongoose.model<user>('User', UserSchema);
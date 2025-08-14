import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    email:{
        type: String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    phoneNo:{
        type:String,
    },
    refreshToken:{
        type:String,
        default:null
    },
    budget:{
        type:Number,
        default:0,
        required:false,
    }
},{
    timestamps:true,
});

export default mongoose.model("User",userschema);
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
     profilePicture: {  
        type: String,
        default: null, 
    },
    refreshToken:{
        type:String,
        default:null
    },
    budget:{
        type:Number,
        default:0,
        required:false,
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
    }
},{
    timestamps:true,
});

export default mongoose.model("User",userschema);
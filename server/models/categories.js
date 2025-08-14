import mongoose from "mongoose"

const categoryschema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true,
        trim:true
    }
})

export default mongoose.model("Category",categoryschema);
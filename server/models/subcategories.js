import mongoose from "mongoose";

const subcategoryschema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        //ref:Category  (if we dont use lookup and use simply find and populate then it will help)
    }
})

export default mongoose.model("Subcategory",subcategoryschema);
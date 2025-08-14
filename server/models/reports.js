import mongoose from "mongoose";

const reportsSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    geeratedAt:{
        type:Date,
        default:Date.now,
    },
    categories:[
        {
            categoryId:{
                type:mongoose.Schema.Types.ObjectId,
                required:true,
            },
            totalAmount:{
                type:Number,
                required:true,
            }
        }
    ]
})

export default mongoose.model("ExpenseReport",reportsSchema);
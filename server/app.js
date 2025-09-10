import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import subCategoryRoutes from "./routes/subCategoryRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import splitwiseRoutes from "./routes/splitwiseRoutes.js"
import emailRoutes from "./routes/emailRotes.js"
import cookieParser from 'cookie-parser';
import path from "path";

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://trackify-expense-tracker.vercel.app" // production frontend
];

app.use(cors({
  origin: function(origin, callback){
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error("CORS not allowed for this origin"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));


app.use("/api/auth",authRoutes)

//expense tracker
app.use("/api/category",categoryRoutes)
app.use("/api/subcategory",subCategoryRoutes)
app.use("/api/expense",expenseRoutes)

//splitwise
app.use("/api/splitwise",splitwiseRoutes)

app.use("/uploads", express.static("uploads"));

app.use('/api', emailRoutes);

export default app;

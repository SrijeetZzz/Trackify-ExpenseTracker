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

app.use(cors({
  origin: "https://trackify-expense-tracker.vercel.app", // explicitly allow your frontend origin
  credentials: true               // allow cookies/credentials
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

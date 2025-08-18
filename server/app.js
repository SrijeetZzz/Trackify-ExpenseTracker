import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import subCategoryRoutes from "./routes/subCategoryRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // explicitly allow your frontend origin
  credentials: true               // allow cookies/credentials
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use("/api/auth",authRoutes)
app.use("/api/category",categoryRoutes)
app.use("/api/subcategory",subCategoryRoutes)
app.use("/api/expense",expenseRoutes)

export default app;

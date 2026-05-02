import express from "express"
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import job from "./crone/crone.js";

import cors from 'cors';

//configure env
dotenv.config();
job.start();

//connection
connectDB();

//rest object 
const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://fullstack-ecom-app-sagar-das.vercel.app'
];


const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // If your frontend needs to include credentials (like cookies)
};




//middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);


//get api
app.get("/", (_req, res) => {
    res.send("<h1>Welcome to My Ecommerce App  APP</h1>")
})

//PORT
const PORT = process.env.PORT || 8000;

//run
app.listen(PORT, () => {
    console.log(`Server Running In ${process.env.DEV_MODE}  mode on port no ${PORT}`.bgYellow.black);
})
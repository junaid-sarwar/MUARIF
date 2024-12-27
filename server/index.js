import express from 'express';
import dotenv from "dotenv";
import { connectDb } from './database/db.js';

dotenv.config();

const app = express();

//using Middlewares
app.use(express.json())

const port = process.env.PORT;

app.get('/',(req,res)=>{
    res.send("Server is Working")
});

app.use("/uploads",express.static("uploads"))

//importing routes 

import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js"

//using routes

app.use('/api',userRoutes)
app.use('/api',courseRoutes)
app.use('/api',adminRoutes)

app.listen(port,()=>{
    console.log(`Server is Running on http://localhost:${port}`);
    connectDb();
})
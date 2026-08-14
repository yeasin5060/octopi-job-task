import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './src/db/db.js';



const app = express();

//Database connection
await connectDB()

app.use(cors({
    origin : "*",
    methods : ["GET" , "POST", "DELETE" , "PUT"],
    allowedHeaders : ["Content-Type", "Authorization"]
}));



app.get("/", (req, res) => {res.send("Server is live!");});



const PORT = process.env.PORT || 5000 ;

app.listen(PORT , ()=> console.log(`Server running on port ${PORT}`))
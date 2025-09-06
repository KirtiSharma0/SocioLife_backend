import 'dotenv/config'
import express, { Express } from 'express'
import cors from 'cors'
import compression from 'compression';
import cookieParser from 'cookie-parser'
import connectDB from './config/connectDB';

const app:Express = express();

app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


connectDB()
.then(()=>{
    const PORT = process.env.PORT;
    app.listen(PORT,()=>{
        console.log(`app is listening on port ${PORT}`);
    })
})
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { connection, sequelize } from './db/index.js';

import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js';
import walletRoutes from './routes/wallet.routes.js';


import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(cookieParser());




app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wallet', walletRoutes);

const port = process.env.PORT || 8000;



connection()
.then(() =>{
    app.listen(port,()=>{
        console.log(`Server is running in port ${port}`);
    
    })
})
.catch((err) => {
    console.log("databse connection failed");
    
})
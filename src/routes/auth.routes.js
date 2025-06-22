import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { registerUser, signIn } from "../controllers/auth.controller.js";


const authRoutes = express.Router();


authRoutes.post("/signup", registerUser)
authRoutes.post("/signin",signIn)
// authRoutes.get("/getuser",authenticateUser,(req,res)=>{
//     res.json({message:"protected route", username: req.username})
// })




export default authRoutes;
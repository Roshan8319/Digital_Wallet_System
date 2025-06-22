import express from "express";
import { addProduct, getAllProducts, buyProduct } from "../controllers/product.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
const productRoutes = express.Router();


productRoutes.post("/addproduct", authenticateUser, addProduct)
productRoutes.post("/buyproduct", authenticateUser, buyProduct)
productRoutes.get("/",getAllProducts);




export default productRoutes;
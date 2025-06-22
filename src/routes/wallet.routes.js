import express from "express";
import { getBalance, creditWallet, debitWallet, payuser, getTransactionHistory } from "../controllers/wallet.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const walletRoutes = express.Router();

walletRoutes.use(authenticateUser);

walletRoutes.get("/balance", getBalance);
walletRoutes.post("/credit", creditWallet);
walletRoutes.post("/debit",debitWallet);
walletRoutes.post("/payuser", payuser);
walletRoutes.get("/history", getTransactionHistory );




export default walletRoutes;
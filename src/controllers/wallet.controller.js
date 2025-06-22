import dotenv from 'dotenv';
dotenv.config();

import { models } from "../db/index.js";
import fetch from 'node-fetch';

const api_key = process.env.API_KEY

const BASE_CURRENCY = 'INR';
const getBalance = async (req, res) => {
    try {
        const user = await models.user.findByPk(req.user.userid);
        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        let balance = parseFloat(user.balance);
        let currency = BASE_CURRENCY ;
          const targetCurrency = req.query.currency?.toUpperCase();

    if (targetCurrency && targetCurrency !== BASE_CURRENCY){
        const url = `https://currencyapi.com/api/v3/latest?apikey=${api_key}&base_currency=${BASE_CURRENCY}&currencies=${targetCurrency}`;

      const response = await fetch(url);
      if (!response.ok) {
        return res.status(502).json({ message: "Failed to fetch currency rates" });
      }

      const data = await response.json();

      const rate = data?.data?.[targetCurrency]?.value;
      if (!rate) {
        return res.status(400).json({ message: "Invalid target currency" });
      }

      balance = balance * rate;
      currency = targetCurrency;
    }
        res.json({balance: parseFloat(balance.toFixed(2)), currency});
    }catch {
        res.status(500).json({error: "failed to fetch balance"});
    }
}

const creditWallet = async(req, res) =>{
    const {amount} = req.body;
    if(!amount || isNaN(amount)){
        return res.status(400).json({message: "invalid amount"})
    }
    try{
        const user = await models.user.findByPk(req.user.userid);
        if(!user){
            return res.status(404).json({message: "user not found"})
        }
        const newBalance = parseFloat(user.balance)+parseFloat(amount);
        user.balance=newBalance;
        await user.save();

        await models.transaction.create({
            kind: 'credit',
            amount: amount,
            update_balance: newBalance,
            userid: user.userid
        })
        res.json({message: "wallet credited", balance: newBalance})
    }catch(error){
        res.status(500).json({error: "failed to credit wallet"});
    }
}

const debitWallet = async(req, res) =>{
    const{amount} = req.body;
     if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: 'Valid amount is required' });
    }
    try{
        const user = await models.user.findByPk(req.user.userid)
         if (!user) return res.status(404).json({ message: 'User not found' });
         if(parseFloat(user.balance) < parseFloat(amount)){
            return res.status(400).json({message: "insufficient balance"})
         }
         const newBalance = parseFloat(user.balance) - parseFloat(amount);
         user.balance = newBalance;
         await user.save();

         await models.transaction.create({
            kind: 'debit',
            amount: amount,
            update_balance: newBalance,
            userid: user.userid,
         })
         res.json({message:"'wallet debited", balance: newBalance})
    }catch(error){
        res.status(500).json({ error: 'Failed to debit wallet' });
    }
}

const payuser = async (req, res) =>{
    const {to, amount} = req.body;
     if (!to || !amount || isNaN(amount)) {
        return res.status(400).json({ message: 'Recipient username and valid amount are required' });
    }
     try {
        const sender = await models.user.findByPk(req.user.userid);
        if (!sender) return res.status(404).json({ message: "Sender not found" });

        const recipient = await models.user.findOne({ where: { username: to } });
        if (!recipient) return res.status(400).json({ message: "Recipient does not exist" });

        const pamount = parseFloat(amount);

        if (sender.userid === recipient.userid) {
            return res.status(400).json({ message: "Cannot transfer to yourself" });
        }

        if (parseFloat(sender.balance) < pamount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

       
        sender.balance -= pamount;
        await sender.save();

       
        recipient.balance = parseFloat(recipient.balance) + pamount;
        await recipient.save();

        
        await models.transaction.create({
            kind: 'debit',
            amount: pamount,
            update_balance: sender.balance,
            userid: sender.userid,
            remarks: `Paid to ${recipient.username}`
        });

        
        await models.transaction.create({
            kind: 'credit',
            amount: pamount,
            update_balance: recipient.balance,
            userid: recipient.userid,
            remarks: `Received from ${sender.username}`
        });

        res.json({ balance: sender.balance });
    } catch (error) {
        console.error('[PAY USER] error:', error);
        res.status(500).json({ message: 'Failed to complete payment' });
    }
}

const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await models.transaction.findAll({
      where: { userid: req.user.userid },
      order: [['createdAt', 'DESC']],  
      attributes: [
        ['kind', 'kind'],
        ['amount', 'amt'],
        ['update_balance', 'updated_bal'],
        ['createdAt', 'timestamp']
      ],
    });

    res.json(transactions);
  } catch (error) {
    console.error("[TRANSACTION HISTORY] error:", error);
    res.status(500).json({ message: "Failed to fetch transaction history" });
  }
};


export {getBalance , creditWallet, debitWallet, payuser, getTransactionHistory}
import { models } from "../db/index.js";


const addProduct = async (req, res) => {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const product = await models.product.create({ name, price, description });
        res.status(201).json({ message: 'Product added', product });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
};

 const getAllProducts = async (req, res) => {
    try {
        const products = await models.product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list products' });
    }
};


const buyProduct = async (req, res) => {
    const { pid } = req.body;
 console.log('[BUY] pid:', pid, 'user:', req.user);
    if (!pid) return res.status(400).json({ message: 'Product ID required' });

    try {
        const product = await models.product.findByPk(pid);
        if (!product) return res.status(404).json({ message: 'Product not found' });
console.log('[BUY] product:', product);
        const user = await models.user.findByPk(req.user.userid);
        if (!user) return res.status(404).json({ message: 'User not found' });
console.log('[BUY] user balance:', user?.balance);
        if (parseFloat(user.balance) < parseFloat(product.price)) {
            return res.status(400).json({ message: 'Insufficient balance to buy this product' });
        }

        const newBalance = parseFloat(user.balance) - parseFloat(product.price);
        user.balance = newBalance;
        await user.save();
   console.log('[BUY] new balance:', user.balance);
        await models.transaction.create({
            kind: 'debit',
            amount: product.price,
            update_balance: newBalance,
            userid: user.userid,
            pid: product.pid
        });
console.log('[BUY] transaction created');
        res.json({ message: 'Product purchased successfully', balance: newBalance });
    } catch (error) {
        console.error('[BUY] error:', error);
        res.status(500).json({ error: 'Failed to purchase product' });
    }
};

export {addProduct, getAllProducts, buyProduct}

 
import dotenv from 'dotenv';
dotenv.config();


import { Sequelize } from 'sequelize';

import {createUserModel} from '../models/users.js'
import { ProductModel } from '../models/product.js';
import { TransactionModel } from '../models/transaction.js'; 

const sequelize = new Sequelize(process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_URI,
  dialect: 'postgres',
  port: process.env.DATABASE_PORT,
        dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    },
    define: {
        freezeTableName: true, 
    },
    logging: false,
});


const user = createUserModel(sequelize);
const product = ProductModel(sequelize);
const transaction = TransactionModel(sequelize);

const models = {user, product, transaction};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        

        await sequelize.sync();

        console.log("Data syncronized successfully in database");
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export {sequelize, connection, models, user, product, transaction}
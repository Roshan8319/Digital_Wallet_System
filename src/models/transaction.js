import { DataTypes, Sequelize } from "sequelize";



export const TransactionModel = (sequelize) =>{
    const Transaction = sequelize.define(
        "Transaction", {
            kind: {
                type: DataTypes.ENUM('credit', 'debit'),
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL,
                allowNull:false,
            },
            update_balance: {
                type: DataTypes.DECIMAL,
                allowNull:false,
            },
            userid: {
                type: DataTypes.UUID,
                allowNull:false,
            },
            pid:{
                type:DataTypes.UUID,
                allowNull:true,
            },
            remarks:{
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            freezeTableName: true,
            timestamps: true
        }
    );

    Transaction.associate = models =>{
        Transaction.belongsTo(models.user,{foreignKey: "userid"});
        Transaction.belongsTo(models.product,{foreignKey: "pid"});
    }
    return Transaction;
}

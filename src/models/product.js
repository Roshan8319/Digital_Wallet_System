import { DataTypes, Sequelize } from "sequelize";



export const ProductModel = (sequelize) =>{
    const Product = sequelize.define(
        "Product", {
            pid: {
                type: DataTypes.UUID,
                defaultValue:DataTypes.UUIDV4,
                allowNull: false,
                unique:true,
                primaryKey: true,
            },
            name:{
                type:DataTypes.STRING,
                allowNull:false,
            },
            price:{
                type: DataTypes.DECIMAL,
                allowNull:false,
            },
            description:{
                type:DataTypes.STRING,
                allowNull:false,
            }
            
        },
        {
            freezeTableName: true,
            timestamps: true
        }
    );
    Product.associate = (models) => {
        Product.hasMany(models.transaction, {foreignKey: "pid"});
    }
   
    return Product;
}

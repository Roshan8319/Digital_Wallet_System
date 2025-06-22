import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const jwt_secret_key = "3Jx7cT02sd9e94JbNzF1NODbcEYi2MquV2EywD3Q56L7hnE8pP+HzK3yMWbUKqYlQmL3PbLGm3EoZnloNCGDhw"

const jwt_refresh_key = "0712d28c62a7b422c4f15123681957bafc318eaf5b99b421d8cb5ddfe23c8f62b73a4481021698af1b9c8d511e99f42a27630f044ad12646fb6667d6bb218b06dca3dc3dac285c47d2cc3edeb08a4609f3b70d66a37a18b6612b405dc13573051fcbccaab9163f5a15dc44ade1036f5f5c6a447d163930aec11e8a9a15138596990840ee69007b237e29e260179d17bc3111161bc0ba7d788cf67ad53372b081c5492b77f0e7631430af96f8ab064e6a4d3cdd2c9d764f7944a33ce9da16cd12544863021ca2b5c560a844dca26a18fffb93ddfda081c1ec162b0dc9acca0662865554f8cff7d29dbc884557600d42b50d956f27cabcf48364d6ae44342d4f61"


export const createUserModel = (sequelize) =>{
    const User = sequelize.define(
        "User", {
            userid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique:true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull:false,
            },
            balance:{
                type: DataTypes.DECIMAL,
                allowNull:false,
                defaultValue: 0,
            },
            accessToken: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            refreshToken: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

        },
        {
            freezeTableName:true
        }
        
    );
    User.beforeCreate(async (user) => {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
    });

    User.prototype.validatePassword = async function(password){
        return await bcrypt.compare(password,this.password)
    }

    User.prototype.generateAccessToken = function () {
        return jwt.sign(
            {
            userid : this.userid,
            username : this.username,
            },
            jwt_secret_key
            
        )

    };
    User.prototype.generateRefreshToken = function () {
        return jwt.sign(
            {
                userid: this.userid,

            },
            jwt_refresh_key
        )
    }
    return User;
}
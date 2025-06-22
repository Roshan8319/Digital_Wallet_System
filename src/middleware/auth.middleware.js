import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

const jwt_secret_key = "3Jx7cT02sd9e94JbNzF1NODbcEYi2MquV2EywD3Q56L7hnE8pP+HzK3yMWbUKqYlQmL3PbLGm3EoZnloNCGDhw"

const jwt_refresh_key = "0712d28c62a7b422c4f15123681957bafc318eaf5b99b421d8cb5ddfe23c8f62b73a4481021698af1b9c8d511e99f42a27630f044ad12646fb6667d6bb218b06dca3dc3dac285c47d2cc3edeb08a4609f3b70d66a37a18b6612b405dc13573051fcbccaab9163f5a15dc44ade1036f5f5c6a447d163930aec11e8a9a15138596990840ee69007b237e29e260179d17bc3111161bc0ba7d788cf67ad53372b081c5492b77f0e7631430af96f8ab064e6a4d3cdd2c9d764f7944a33ce9da16cd12544863021ca2b5c560a844dca26a18fffb93ddfda081c1ec162b0dc9acca0662865554f8cff7d29dbc884557600d42b50d956f27cabcf48364d6ae44342d4f61"

const authenticateUser = (req, res, next) => {
    try {
        
        const token = req.cookies?.accessToken
        
        if (!token) {
            throw new ApiError(401, "Missing access token. Please login.");
        }

        const decoded = jwt.verify(token, jwt_secret_key);
        req.user = {
            userid: decoded.userid,
            username: decoded.username,
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access", error: error.message });
    }
};


export {authenticateUser}
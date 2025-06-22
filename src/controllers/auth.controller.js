import { user } from '../db/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/apiError.js';
import {ApiResponse} from '../utils/apiResponse.js';
import bcrypt from 'bcryptjs';

const registerUser = asyncHandler(async(req, res)=>{
    const {username,password, balance} = req.body

    if(!username || !password){
        throw new ApiError(400,"please enter required fields");

    }
    const existingUser = await user.findOne({where:{username}})
    if(existingUser){
        throw new ApiError(400,"user already registered")
    }
    await user.create({
        username,
        password,
        balance,
    })
    const newUser = await user.findOne({
        where: {username},

    })
    return res.status(201).json(new ApiResponse(200, newUser,"User register successfully"))

})

const signIn = asyncHandler(async(req,res)=>{
    const {username, password} = req.body;

    if(!username || !password){
        throw new ApiError(400, "ALL fields required")
    }

    const requestedUser = await user.findOne({where:{username}})

    if(!requestedUser){
        throw new ApiError(400,"user not registered")
    }

   const isPasswordCorrect =  user.prototype.validatePassword = async function(password){
            return await bcrypt.compare(password,this.password)
        }
    
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid login credentials")
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(requestedUser.userid);
    const loggedInUser = await user.findOne({
        where:{userid:  requestedUser.userid},
        attributes:{exclude:["password", 'refreshToken']}
    }) 
    const options={
        httpOnly:true,
        secure:true,
        sameSite:"None",
        maxAge:7*24*60*60*1000,
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken,
            },
            "User logged in successfully",
            console.log("User logged in successfully")
            
        )
    )
    
})


const generateAccessAndRefreshToken = async(userid)=>{
    try{
        const requestedUser=await user.findByPk(userid)
        if(!requestedUser){
            throw new ApiError(400," User not found while generating access token and refresh token.")
        }
        const accessToken = requestedUser.generateAccessToken()
        const refreshToken = requestedUser.generateRefreshToken()
        requestedUser.accessToken=accessToken
        requestedUser.refreshToken=refreshToken
        await requestedUser.save()
        return { accessToken, refreshToken}
    }catch(error) {
        console.log("error generating token",error);
        throw new ApiError(500,"Something went wrong while generating access and refresh tokens")
    }
}
export {registerUser, signIn}
import jwt from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const verifyAccessToken =(req,res,next)=>{
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) return res.status(401).json({message:"Access token missing"});

    jwt.verify(token,ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err) return res.status(403).json({message:"Invalis Access token"})

        req.user = decoded; // has userId, name , email
        next();
    })
}
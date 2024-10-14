const jwt = require('jsonwebtoken')

const verify = (req,res,next)=>{
    const tokenCheck = req.headers["authorization"]

    const extractedToken = tokenCheck.split(" ")[1]; //["Bearer",<token>]

    if(extractedToken){
        jwt.verify(extractedToken,process.env.SECRET_KEY,(err,decode)=>{
            if(err){
                res.json({"Message":"Invalid Token!!",err:err}).status(500)
            }else{
                
                req.email = decode.email;
                req.userId = decode.userId;
                next();
            }
        })
    }
}

module.exports = verify;
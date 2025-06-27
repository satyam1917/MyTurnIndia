const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

const userAuth = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token) {
            token=token.split(" ")[1];
            let user=jwt.verify(token,SECRET_KEY);
            req.userId=user.id;
        }
        else{
            res.status(401).json({message:"Unauthorize user"});
        }
        next();
    } catch (error) {
        res.status(401).json({message:"Unauthorize user"});
    }

}

module.exports=userAuth;
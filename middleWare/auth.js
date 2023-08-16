const jwt = require('jsonwebtoken');
const User = require('../model/usertable');

const  authenticate  = async (req,res,next)=>{
    try {
        const token = req.header('Authorization');

        const user = jwt.verify(token,'secretKey');
        await User.findById(user.userId).then(user=>{

          req.user = user;

            next()
        })

    
        
    } catch (error) {
        console.log(error)
    }

}
module.exports={
    authenticate
}
const JWT=require('jsonwebtoken');
const secret='Bl0GK3Y'

function generateTokenForUser(user){
    const payload={
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        pfpUrl:user.pfpUrl,
        role:user.role
    }
    const token=JWT.sign(payload,secret);
    return token;
}

function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports={
    validateToken,generateTokenForUser
}
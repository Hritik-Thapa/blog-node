const { validateToken } = require("../services/authentication");

function authenticateCookie(cookieName) {
  return (req, res, next) => {
    const cookieToken = req.cookies[cookieName];
    if (!cookieToken)return next();

    try {
      const userPayload = validateToken(cookieToken);
      req.user=userPayload;
    } catch (err) {}

    return next();
  };
}


module.exports={authenticateCookie}
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const tokenid = authHeader.split(' ')[1]; //  adjycbd38723h2jbfc ..here we are spliting.. dahbajskdbkjasbd(this value will be there)
  if (!tokenid || tokenid === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try{
    decodedToken= jwt.verify(tokenid,'somesupersecretkey')
  }
  catch(err){
      req.isAuth= false;
      return next();
  }
  if(!decodedToken){
    req.isAuth= false;
    return next();
  }
  req.isAuth= true;
  req.userId= decodedToken.userId;
  next();
};

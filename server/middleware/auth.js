const jwt = require("jsonwebtoken");

// a function to verify token to authorise transaction
const verifyJwt = async (req, res, next) => {
  console.log("in auth");
  let token = req.headers.authorization;
  console.log(token);
  if (!token) {
    // when no token return 403 forbidden unauthorized status
    return res.status(403).send("Token is required");
  }
  // key to decrypt token
  let key = "westride123";
  try {
    // split to get token by splitting bearer and token
    token = token.split(" ");
    // getting an array with 2 indexes
    // verify token
    let decode = jwt.verify(token[1], key);
    console.log(decode, "<<< decode ");
    // send decoded token to req._user
    req._user = decode;
    // next to get it going further otherwise its done after running in this try box
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send(error);
  }
};

module.exports = verifyJwt;

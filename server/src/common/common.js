// import crypto
const crypto = require("crypto");
// import jwt jsonwebtoken
const jwt = require("jsonwebtoken");

const encrypted = async (data) => {
  try {
    // algorithm
    let algo = "aes256";
    // key
    let key = "westride123";

    // encrypting
    let cipher = crypto.Cipher(algo, key);
    let encrypted = cipher.update(data, "utf8", "hex") + cipher.final("hex");
    return encrypted;
  } catch (err) {
    console.log(err);
  }
};

// decrypting
const decrypted = async (data) => {
  try {
    let algo = "aes256";
    let key = "westride123";

    let decipher = crypto.Decipher(algo, key);
    let decrypted =
      decipher.update(data, "hex", "utf8") + decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.log(err);
  }
};

// generate token function
// see jwt.io to see token info
const generateToken = async (data) => {
  try {
    let key = "westride123";
    // data is the object we want to put also in the token
    let token = jwt.sign(data, key, { expiresIn: "30m" });
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  commonService: {
    encrypted,
    decrypted,
    generateToken,
  },
};

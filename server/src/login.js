// login logic
// check for username
// if exists check for password
// when pass generate token
// session expire
const pool = require("../db/pool.js");
// import common decipher
const common = require("./common/common");

const exec = async (req, res) => {
  // declare resonseData and client outside to use it in both try and catch and finallyy
  let responseData = {};
  // open transaction
  let client = await pool.connect();
  try {
    // get data from body (username,password)
    let data = req.body;
    let sql = `SELECT * from public.user WHERE user_name = $1`;
    let param = [data.userName];
    let responseUser = await pool.query(sql, param);

    // check if the passsed userName registered
    if (responseUser.rowCount < 1) {
      // if not found update responseData to return
      responseData.success = false;
      responseData.data = "user not found";
    } else if (!responseUser.rowCount < 1) {
      // decrypt data from encrypted data from database
      // check if it matches data from req.body passsword

      let decryptedPwd = await common.commonService.decrypted(
        responseUser.rows[0].password
      ); //row 0 cus user info the first object in array rows
      console.log(decryptedPwd);
      // condition to check decrypted data and data.password
      if (decryptedPwd == data.password) {
        // data to be put in token
        let tokenObj = { user_id: responseUser.rows[0].user_uuid };
        responseData.success = true;
        // when success send user info data to frontend
        responseData.data = responseUser.rows.map((i) => ({
          id: i.user_uuid,
          firstName: i.first_name,
          lastName: i.last_name,
          userName: i.user_name,
        }));
        //   set token to responseData
        responseData._token = await common.commonService.generateToken(
          tokenObj
        );
        console.log(responseData._token);
      } else {
        // if password not matches
        responseData.success = false;
        responseData.data = "invalid password";
      }
    }
  } catch (error) {
    console.log(error);
    responseData.success = false;
  } finally {
    // close
    client.release();
  }
  //   return response
  res.status(200).send(responseData);
  return res.end;
};

module.exports = exec;

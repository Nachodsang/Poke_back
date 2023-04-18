// import pool
const { response } = require("express");
const pool = require("../db/pool");
// import common service for token generate
const common = require("./common/common");

const exec = async (req, res) => {
  console.log("in get score");
  //   open connect databasea
  let client = await pool.connect();
  let responseData = {};
  let tokenObj = { user_id: req._user.user_id };

  try {
    let sql = `SELECT pokemon_id, COUNT(pokemon_id) as score FROM public.vote
    GROUP BY pokemon_id
    ORDER BY score DESC`;
    // send to execution
    let response = await pool.query(sql);
    console.log(response);

    // check if array of response is not empty
    if (response.rows.length) {
      responseData.success = true;
      responseData.data = response.rows;
    } else {
      responseData.success(false);
    }
  } catch (error) {
    console.log(error);
    responseData.success = false;
  } finally {
    client.release();
  }
  responseData._token = await common.commonService.generateToken(tokenObj);
  res.status(200).send(responseData);
  return res.end;
};

module.exports = exec;

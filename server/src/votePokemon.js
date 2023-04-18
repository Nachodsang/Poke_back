const pool = require("../db/pool");
const common = require("./common/common");

const exec = async (req, res) => {
  // open and begin cus we gonna insert data as well
  let client = await pool.connect();
  await client.query("BEGIN");

  // make user_uuid to object for token
  let tokenObj = { user_id: req._user.user_id };
  console.log(req._user, "<<<<<<<req user");

  let responseData = {};
  try {
    let data = req.body;
    let voteItem = data.item;
    // get user_id from req.user
    let user_uuid = req._user.user_id;

    // for loop to get objects from array and keep them
    for (const v of voteItem) {
      let sql = `INSERT INTO public.vote
(pokemon_id, user_uuid, create_date, create_by)
VALUES($1,$2,now(),$3);
`;
      let param = [v.id, user_uuid, user_uuid];
      let response = await pool.query(sql, param);
    }
    // return success
    // and commit change to confirm query insert
    responseData.success = true;
    client.query("COMMIT");
  } catch (error) {
    console.log(error);
    // rollback to not letting the insert proceed with error
    client.query("ROLLBACK");
    responseData = false;
  } finally {
    client.release();
  }
  //   gen token
  responseData._token = await common.commonService.generateToken(tokenObj);

  res.status(200).send(responseData);
  //   res.end?
};

module.exports = exec;

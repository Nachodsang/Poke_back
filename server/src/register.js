// imoport pool
const pool = require("../db/pool");
// import uuidv4
const { uuid } = require("uuidv4");
// import commonService
const common = require("./common/common");

// function to reggister
const exec = async (req, res) => {
  // open data base to avoid double run
  let client = await pool.connect();
  await client.query("BEGIN");

  let responseData = {};

  try {
    // express will put data in body
    let data = req.body;
    console.log(data, "<<< body");

    // select the firstname and count the row if exists to prevent doubling user
    let sqlUser = `SELECT * FROM public.user WHERE first_name = $1`;
    let paramUser = [data.firstName];
    let responseUser = await pool.query(sqlUser, paramUser);

    // if not exists insert uuser
    if (responseUser.rowCount > 0) {
      // reject with false to responseData object.success property
      responseData.success = false;
      responseData.data = "user duplicate";
    } else {
      // gen user id
      let user_uuid = uuid();
      // encryting password
      let encryptedPwd = await common.commonService.encrypted(data.password);
      // sql code
      let sql = `INSERT INTO public."user"
(user_uuid, first_name, last_name, "password", create_date, create_by,user_name)
VALUES($1,$2,$3,$4,now(),$5,$6);
`;

      let param = [
        user_uuid,
        data.firstName,
        data.lastName,
        encryptedPwd,
        user_uuid,
        data.userName,
      ];
      let response = await pool.query(sql, param);
      console.log(response);
      responseData.success = true;
      //   commit database channge
      client.query("COMMIT");
    }
  } catch (err) {
    console.log(err);
    // if cannot do
    // roll back to cancel
    client.query("ROLLBACK");
    responseData.success = false;
  } finally {
    // close transaction
    client.release();
  }
  //   return to frontend
  res.status(200).send(responseData);
  return res.end();
};

module.exports = exec;

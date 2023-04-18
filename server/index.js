// dependencies used here
// express, body-parser,nodemon,uuidv4,pg-pool,crypto-js,jsonwebtoken

const express = require("express");
// import bodyParser
const bodyParser = require("body-parser");
// assign express to var app
const app = express();

// port set
const PORT = 8080;
// import register
const register = require("./src/register");
// import login
const login = require("./src/login");
// import vote pokemon
const votePokemon = require("./src/votePokemon");
// import auth (middle ware)
const auth = require("./middleware/auth");
// import getScore
const getScorePokemon = require("./src/getScorePokemon");

// body to json///////
app.use(bodyParser.json());
// set header accessebility
// next is what to do next
// * cus can access from anyone just for the case of learning
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // set header
  res.header("Access-Control-Allow-Methods", "GET, POST,PUT,PATCH,DELETE");
  // what is allowed in header
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,x-access-token,x-refresh-token,_id,Authorization"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "x-access-token, x-refresh-token"
  );
  // what to do next
  next();
});

// when app run run this
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
// router path , receive request and set response
app.get("/hello", async (req, res) => {
  // send reponse to json format
  res.json("Hello YOYO");
});

// router path , receive request and set response
// run this funcition when in path register
app.post("/register", async (req, res) => {
  // call register and send args
  register(req, res);
});

// Login
app.post("/login", async (req, res) => {
  console.log("in login");
  // call loginn fuuctiion
  login(req, res);
});

// votePokemon
// call auth before the rest callback fc
app.post("/pokemon/vote", auth, async (req, res) => {
  console.log("in vote");
  votePokemon(req, res);
});

// get score in path /pokemon/score/all
app.get("/pokemon/score/all", auth, async (req, res) => {
  console.log("in path getscore");
  getScorePokemon(req, res);
});

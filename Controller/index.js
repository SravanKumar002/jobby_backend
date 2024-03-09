const models = require("../Model/index.js");
const mongoose = require("mongoose");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const fetch = require('node-fetch')
const db = mongoose.connection;
const dotenv = require("dotenv");
const { has } = require("lodash");
dotenv.config();

const AuthorizeUser = async (req, res, next) => {
  let jwt_token;
  try {
    const header = req.headers;
    if (header != undefined) {
      jwt_token = header.authorization.split(" ")[1];
    }
    if (jwt_token === undefined) {
      res.status(400).send({ error: "unauthorized user invalid jwt" });
    } else {
      const payload = await jwt.verify(jwt_token, process.env.jwtSecreatToken);

      next();
    }
  } catch (e) {
    res.status(400).send({ error: e });
  }
};

const Register = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  console.log(email);
  // console.log(username);
  const user = await models.findOne({ email });
  try {
    // console.log(user);
    if (user == null) {
      const hasedpassword = await bcrypt.hash(password, 10);
      const newuser = {
        username,
        email,
        password: hasedpassword,
      };
      console.log(newuser, hasedpassword);
      const modleduser = models.create(newuser);
      //   const result = await modleduser.save()
      res.status(200).send({ message: "User registered success" });
    } else {
      res.status(403).send({ error: "User already exists" });
    }
  } catch (e) {
    res.status(400).send({ error: e });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body.body;
    console.log(email);

    const user = await models.findOne({ email: email });
    console.log(user);
    if (user != null) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword) {
        const payload = { email };
        const credentials = {
          username: "rahul",
          password: "rahul@2021",
        };
        axios
          .post("https://apis.ccbp.in/login", credentials)
          .then((response) => {
            return res.status(200).send({
              ok: true,
              jwt_token: response.data.jwt_token,
              message: "Login successful",
            });
          })
          .catch((error) => {
            console.error("Error:");
          });

        console.log(payload);
      } else {
        res.status(401).send({ error: "Password wrong" });
      }
    } else {
      res.status(401).send({ error: "User dosent exist" });
    }
  } catch (err) {
    res.send({ error: "catch" });
  }
};

module.exports = {
  AuthorizeUser,
  Register,
  Login,
};

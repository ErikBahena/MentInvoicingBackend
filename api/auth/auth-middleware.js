const bcrypt = require("bcryptjs");
const User = require("../user/users-model");

const jwt = require("jsonwebtoken");
const { tokenBuilder } = require("./auth-helpers");

const { BCRYPT_ROUNDS, JWT_SECRET } = require("../../config");

const validateUserLogin = (req, res, next) => {
  const user = req.body;

  if (
    !user.password ||
    user.password.trim() === "" ||
    !user.username ||
    user.username.trim() === ""
  ) {
    return next({
      status: 400,
      message: "username and password required",
    });
  } else next();
};

const validateUserRegister = (req, res, next) => {
  const user = req.body;

  if (
    !user.password ||
    user.password.trim() === "" ||
    !user.email ||
    user.email.trim() === "" ||
    !user.username ||
    user.username.trim() === ""
  ) {
    return next({
      status: 400,
      message: "username, email and password required",
    });
  } else next();
};

const alreadyExistsInDb = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.getBy("email", email);

  if (user) return next({ status: 400, message: "email already in use" });
  else next();
};

const checkUsernameExists = async (req, res, next) => {
  const { username } = req.body;

  const user = await User.getBy("username", username);

  if (!user)
    return next({
      status: 401,
      message: "that username is not registered to any user",
    });

  req.userFromDb = user;
  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  const userFromDb = req.userFromDb;

  if (bcrypt.compareSync(password, userFromDb.password)) {
    req.token = tokenBuilder(userFromDb);
    next();
  } else next({ status: 401, message: "wrong password" });
};

const hashPassword = (req, res, next) => {
  const user = req.body;

  const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS);
  user.password = hash;

  req.token = tokenBuilder(user);
  req.user = user;
  next();
};

const restricted = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return next({ status: 401, message: "token required" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next({ status: 401, message: "token invalid" });
    else next();
  });
};

module.exports = {
  validateUserLogin,
  validateUserRegister,
  alreadyExistsInDb,
  checkUsernameExists,
  validatePassword,
  hashPassword,
  restricted,
};

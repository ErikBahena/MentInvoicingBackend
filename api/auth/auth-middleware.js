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
    !user.email ||
    user.email.trim() === ""
  ) {
    return next({
      status: 400,
      message: "email and password required",
    });
  } else next();
};

const validateUserRegister = (req, res, next) => {
  const user = req.body;

  if (
    !user.password ||
    user.password.trim() === "" ||
    !user.email ||
    user.email.trim() === ""
  )
    return next({
      status: 400,
      message: "email and password required",
    });
  else next();
};

const alreadyExistsInDb = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findBy("email", email);

  if (user) return next({ status: 400, message: "email already in use" });
  else next();
};

const checkEmailExists = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findBy("email", email);

  if (!user)
    return next({
      status: 401,
      message: "that email is not registered to any user",
    });

  req.userFromDb = user;
  next();
};

const validatePassword = (req, res, next) => {
  if (bcrypt.compareSync(req.body.password, req.userFromDb.password)) {
    req.token = tokenBuilder(req.userFromDb);
    next();
  } else next({ status: 401, message: "wrong password" });
};

const hashPassword = (req, res, next) => {
  const user = req.body;

  user.password = bcrypt.hashSync(user.password, BCRYPT_ROUNDS);

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
  checkEmailExists,
  validatePassword,
  hashPassword,
  restricted,
};

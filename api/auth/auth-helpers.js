const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");

function tokenBuilder(user) {
  const payload = {
    username: user.username,
    email: user.email,
    user_id: user.user_id,
  };
  const options = {
    expiresIn: "1d",
  };
  const result = jwt.sign(payload, JWT_SECRET, options);

  return result;
}

module.exports = {
  tokenBuilder,
};

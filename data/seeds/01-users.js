exports.seed = function (knex) {
  return knex("users").insert([
    {
      email: "erikjbahena@gmail.com",
      password: "1234",
      username: "ErikB",
    },
  ]);
};
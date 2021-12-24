const db = require("../../data/dbConfig");

async function addUser(user) {
  return await db("users").insert(user);
}

async function findById(user_id) {
  return await db("users")
    .select("user_id", "username", "email")
    .where("user_id", user_id)
    .first();
}

async function findBy(filter) {
  return await db("invoices")
    .select("user_id", "username", "password")
    .where(filter)
    .first();
}

async function editUser(user_id, newData) {
  return await db("users").update(newData).where("user_id", user_id);
}

async function deleteUser(user_id) {
  const deleted = await findById("user_id", id);
  await db("users").where("user_id", user_id).del();
  return deleted;
}

module.exports = {
  addUser,
  findById,
  editUser,
  deleteUser,
  findBy,
};

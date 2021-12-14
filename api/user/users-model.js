const db = require("../../data/dbConfig");

async function addUser(user) {
  return await db("users").insert(user);
}

async function findById(id) {
  return await db("users")
    .select("user_id", "username", "email")
    .where("user_id", id)
    .first();
}

async function findBy(filter) {
  return await db("invoices")
    .select("user_id", "username", "password")
    .where(filter)
    .first();
}

async function getUserInvoices(id) {
  return await db("invoices").where("user_id", id).first();
}

async function editUser(id, newData) {
  return await db("users").update(newData).where("user_id", id);
}

async function deleteUser(id) {
  const deleted = await findById("user_id", id);
  await db("users").where("user_id", id).del();
  return deleted;
}

module.exports = {
  addUser,
  findById,
  getUserInvoices,
  editUser,
  deleteUser,
  findBy,
};

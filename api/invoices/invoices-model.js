const db = require("../../data/dbConfig");

async function getSaCaI(invoice) {
  invoice.senderAddress = await db("sender_addresses as sa")
    .select(
      "sa.city",
      "sa.country",
      "sa.postCode",
      "sa.street",
      "sa.invoice_id"
    )
    .where("sa.invoice_id", invoice.invoice_id)
    .first();

  invoice.clientAddress = await db("client_addresses as ca")
    .select(
      "ca.city",
      "ca.country",
      "ca.postCode",
      "ca.street",
      "ca.invoice_id"
    )
    .where("ca.invoice_id", invoice.invoice_id)
    .first();

  invoice.items = await db("items as i")
    .select("i.name", "i.price", "i.quantity", "i.invoice_id")
    .where("i.invoice_id", invoice.invoice_id);

  invoice.items.forEach((item) => (item.total = item.price * item.quantity));

  let sum = 0;
  invoice.items.forEach((item) => (sum += item.total));
  invoice.total = sum;

  return invoice;
}

const getAll = async (user_id) => {
  const invoices = await db("invoices").where("user_id", user_id);

  return Promise.all(
    invoices.map(async (invoice) => {
      return await getSaCaI(invoice);
    })
  );
};

const getById = async (invoice_id) => {
  const invoice = await db("invoices").where("invoice_id", invoice_id).first();

  return await getSaCaI(invoice);
};

const add = async (user_id, potluck) => {
  const potluckDetails = {
    date: potluck.date,
    time: potluck.time,
    location: potluck.location,
    title: potluck.title,
    description: potluck.description,
    createdBy: user_id,
  };

  const [newPotluckId] = await db("potlucks as p")
    .insert(potluckDetails)
    .returning("p.potluck_id");

  if (potluck.invites.length > 0) {
    const invites = potluck.invites;

    for (const invite of invites) {
      invite.potluck_id = newPotluckId;

      await db("potluck_invites").insert(invite);
    }
  }

  if (potluck.items.length > 0) {
    const items = potluck.items;

    for (const item of items) {
      item.potluck_id = newPotluckId;

      await db("potluck_items").insert(item);
    }
  }

  return getAll(user_id);
};

const update = async (potluck_id, potluck, user_id) => {
  const potluckDetails = {
    date: potluck.date,
    time: potluck.time,
    location: potluck.location,
    title: potluck.title,
    description: potluck.description,
  };

  await db("potlucks as p")
    .where("p.potluck_id", potluck_id)
    .update(potluckDetails);

  if (potluck.invites.length > 0) {
    const invites = potluck.invites;

    for (const invite of invites) {
      await db("potluck_invites as pi")
        .where("pi.invite_id", invite.invite_id)
        .update(invite);
    }
  }

  if (potluck.items.length > 0) {
    const items = potluck.items;

    for (const item of items) {
      await db("potluck_items as pi")
        .where("pi.item_id", item.item_id)
        .update(item);
    }
  }

  return getAll(user_id);
};

const deletePotluck = async (potluck_id, user_id) => {
  await db("potlucks as p").where("p.potluck_id", potluck_id).del();

  return getAll(user_id);
};

module.exports = { getAll, getById, add, update, deletePotluck };

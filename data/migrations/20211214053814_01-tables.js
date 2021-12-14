/**
 * {
      id: "RT3080",
      createdAt: "2021-08-18",
      paymentDue: "2021-08-19",
      description: "Re-branding",
      paymentTerms: 1,
      clientName: "Jensen Huang",
      clientEmail: "jensenh@mail.com",
      status: "paid",
      senderAddress: {
        street: "19 Union Terrace",
        city: "London",
        postCode: "E1 3EZ",
        country: "United Kingdom",
      },
      clientAddress: {
        street: "106 Kendell Street",
        city: "Sharrington",
        postCode: "NR24 5WQ",
        country: "United Kingdom",
      },
      items: [
        {
          name: "Brand Guidelines",
          quantity: 1,
          price: 1800.9,
          total: 1800.9,
        },
      ],
      total: 1800.9,
    },
 */

exports.up = function (knex) {
  return knex.schema
    .createTable("users", (users) => {
      users.increments("user_id");
      users.string("username", 128).notNullable().unique();
      users.string("email", 50).notNullable().unique();
      users.string("password", 128).notNullable();
    })
    .createTable("invoices", (table) => {
      table.increments("id");
      table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();

      table.timestamp("paymentDue");
      table.string("description", 30).defaultTo("no description provided");
      table.integer("paymentTerms");

      table.string("clientName", 20).defaultTo("no client name");
      table.string("clientEmail", 50).defaultTo("no client email");
      table.string("status", 8).notNullable();

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users").dropTableIfExists("invoices");
};

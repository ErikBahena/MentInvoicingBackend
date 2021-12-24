exports.up = function (knex) {
  return knex.schema
    .createTable("users", (users) => {
      users.increments("user_id");

      users.string("username", 20).notNullable().unique();
      users.string("email", 50).notNullable().unique();
      users.string("password", 50).notNullable();

      users.string("photo_url");
    })
    .createTable("invoices", (table) => {
      table.increments("invoice_id");
      table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();

      table.string("paymentDue");
      table.string("description", 50).defaultTo("no description provided");
      table.integer("paymentTerms");

      table.string("clientName", 50).defaultTo("no client name");
      table.string("clientEmail", 50).defaultTo("no client email");
      table.string("status", 8).defaultTo("draft");

      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE");
    })
    .createTable("sender_addresses", (table) => {
      table.increments("sender_address_id");

      table.string("street", 100);
      table.string("city", 100);
      table.string("postCode", 100);
      table.string("country", 100);

      table
        .integer("invoice_id")
        .unsigned()
        .notNullable()
        .references("invoice_id")
        .inTable("invoices")
        .onDelete("CASCADE");
    })
    .createTable("client_addresses", (table) => {
      table.increments("client_address_id");

      table.string("street", 100);
      table.string("city", 100);
      table.string("postCode", 100);
      table.string("country", 100);

      table
        .integer("invoice_id")
        .unsigned()
        .notNullable()
        .references("invoice_id")
        .inTable("invoices")
        .onDelete("CASCADE");
    })
    .createTable("items", (table) => {
      table.increments("item_id");

      table.string("name", 100).notNullable();
      table.integer("quantity", 100).notNullable();
      table.integer("price", 100).notNullable();

      table
        .integer("invoice_id")
        .unsigned()
        .notNullable()
        .references("invoice_id")
        .inTable("invoices")
        .onDelete("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("users")
    .dropTableIfExists("invoices")
    .dropTableIfExists("sender_addresses")
    .dropTableIfExists("client_addresses")
    .dropTableIfExists("items");
};

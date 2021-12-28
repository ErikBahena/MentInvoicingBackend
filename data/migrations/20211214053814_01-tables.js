exports.up = function (knex) {
  return knex.schema
    .createTable("users", (users) => {
      users.increments("user_id");

      users.string("email").notNullable().unique();
      users.string("password", 200).notNullable();

      users.string("photo_url", 200);
    })
    .createTable("invoices", (table) => {
      table.increments("invoice_id");
      table.string("createdAt").defaultTo(knex.fn.now()).notNullable();

      table.string("paymentDue", 200);
      table.string("description", 200);
      table.integer("paymentTerms");

      table.string("clientName", 200);
      table.string("clientEmail", 200);
      table.string("status", 8);

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
      table.decimal("quantity", 100).notNullable();
      table.decimal("price", 100).notNullable();

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
    .dropTableIfExists("items")
    .dropTableIfExists("client_addresses")
    .dropTableIfExists("sender_addresses")
    .dropTableIfExists("invoices")
    .dropTableIfExists("users");
};

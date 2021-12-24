exports.seed = function (knex) {
  return knex("invoices")
    .insert([
      {
        user_id: 1,
        paymentDue: "2021-08-19",
        description: "Re-branding",
        paymentTerms: 1,
        clientName: "Jensen Huang",
        clientEmail: "jensenh@mail.com",
        status: "paid",
      },
    ])
    .then(() => {
      return knex("sender_addresses").insert([
        {
          street: "19 Union Terrace",
          city: "London",
          postCode: "E1 3EZ",
          country: "United Kingdom",
          invoice_id: 1,
        },
      ]);
    })
    .then(() => {
      return knex("client_addresses").insert([
        {
          street: "106 Kendell Street",
          city: "Sharrington",
          postCode: "NR24 5WQ",
          country: "United Kingdom",
          invoice_id: 1,
        },
      ]);
    })
    .then(() => {
      return knex("items").insert([
        {
          name: "Brand Guidelines",
          quantity: 1,
          price: 1800.9,
          invoice_id: 1,
        },
        {
          name: "Material Service Fee",
          quantity: 2,
          price: 20,
          invoice_id: 1,
        },
      ]);
    });
};

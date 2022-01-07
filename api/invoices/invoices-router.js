const router = require("express").Router();
const Invoices = require("./invoices-model");
const { validateInvoice } = require("./invoices-middleware");
const { restricted } = require("../auth/auth-middleware");

// get all invoices
router.get("/:user_id/invoices", restricted, (req, res, next) => {
  Invoices.getAll(req.params.user_id)
    .then((resp) => res.json(resp))
    .catch(next);
});

// get a single invoice
router.get("/:invoice_id", restricted, (req, res, next) => {
  Invoices.getById(req.params.invoice_id)
    .then((resp) => res.json(resp))
    .catch(next);
});

// create a new invoice
router.post("/:user_id", restricted, (req, res, next) => {
  Invoices.add(req.params.user_id, req.body)
    .then((resp) => res.json(resp))
    .catch(next);
});

// // update a invoice
// router.put("/:invoice_id", restricted, validateInvoice, (req, res, next) => {
//   Invoices.update(req.params.invoice_id, req.body)
//     .then((resp) => res.json(resp))
//     .catch(next);
// });

// // delete a invoice
// router.delete("/:invoice_id/:user_id", restricted, (req, res, next) => {
//   Invoices.deleteInvoice(req.params.invoice_id, req.params.user_id)
//     .then((resp) => res.json(resp))
//     .catch(next);
// });

module.exports = router;

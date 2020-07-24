const express = require("express");
const db = require("./data/dbConfig.js");

const router = express.Router();

router.use("/:id", validateAccountId);

router.get("/", async (req, res, next) => {
  try {
    const data = await db("accounts");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to get accounts" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = req.accountInfo;
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to get account by ID" });
  }
});

router.post("/", validateAccountBody, async (req, res, next) => {
  try {
    const data = await db("accounts").insert({ name: req.body.name, budget: req.body.budget });
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to create account" });
  }
});

router.put("/:id", validateAccountBody, async (req, res, next) => {
  try {
    const { id } = req.params;
    await db("accounts")
      .where("id", id)
      .update({ ...req.body }, ["id", "name", "budget"]);
    res.status(200).json({ ...req.body, id });
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to make changes to that account" });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.accountInfo;
    const data = await db("accounts").where("id", id).del();
    res.status(200).json({ message: `Account ${id} deleted` });
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to delete account" });
  }
});

async function validateAccountId(req, res, next) {
  const { id } = req.params;
  // const accountId = await db.get(id);
  const accountId = await db("accounts").where("id", id);
  if (accountId.length !== 0) {
    req.accountInfo = accountId[0];
    next();
  } else next({ status: 404, errorMessage: "Invalid ID" });
}

function validateAccountBody(req, res, next) {
  const { name, budget } = req.body;
  if (name && budget) {
    next();
  } else next({ status: 400, errorMessage: "Please include a name and description" });
}

module.exports = router;

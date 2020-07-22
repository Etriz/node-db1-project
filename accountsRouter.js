const express = require("express");
const db = require("./data/dbConfig.js");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await db("accounts");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next({ status: 500, errorMessage: "Unable to get projects" });
  }
});

module.exports = router;

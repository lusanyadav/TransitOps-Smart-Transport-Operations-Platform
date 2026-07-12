const express = require("express");
const router = express.Router();

const {
  getAllCommon,
  createManyCommon,
  updateCommon,
  deleteCommon,
  getCommonUniqueData,
  getSingleCommon,
} = require("../controllers/commonController");

const auth = require("../middlewares/auth.middleware");

// router.use(auth);

router.get("/", getAllCommon);
router.get("/:id", getSingleCommon);
router.post("/", createManyCommon);
router.post("/unique", getCommonUniqueData);
router.put("/:id", updateCommon);
router.delete("/", deleteCommon);

module.exports = router;

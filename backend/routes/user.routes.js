const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const userCtrl = require("../controllers/user.controller");

router.post("/signup", userCtrl.signup);
router.post("/signin", userCtrl.signin);
router.post("/forgot_pass", userCtrl.forgotPassword);

router.post("/secure", auth, (req, res) => {
  res.json({ message: "Authorized access", user: req.user });
});

module.exports = router;

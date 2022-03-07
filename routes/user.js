const { create, getUser, login } = require("../controllers/user");
const router = require("express").Router();

router.post("/login", login);
router.get("/", getUser);
router.post("/", create);
module.exports = router;
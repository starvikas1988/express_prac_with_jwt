var express = require("express");

const {handelUserSignUp,handelUserLogin,getUserDetails} = require("../Controllers/userController")

const verify = require("../Middleware/verifyMiddleware")

var router = express.Router();

router.post('/signUp',handelUserSignUp);
router.post('/login',handelUserLogin);
 router.get("/getUserDetails",verify,getUserDetails);
//router.get("/getUserDetails",getUserDetails);

module.exports = router;
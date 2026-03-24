const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Start login
router.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Callback
router.get("/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "http://localhost:3000/auth" }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`http://localhost:3000/auth?token=${token}`);
  }
);

module.exports = router;
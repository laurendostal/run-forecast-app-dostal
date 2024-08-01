const { User } = require("../models");

async function create(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.redirect("/signup?error=must include username and password");

    const user = await User.create(username, password);

    if (!user) return res.redirect("/signup?error=error creating new user");

    req.session.isLoggedIn = true;
    req.session.userid = user.id;
    req.session.save(() => res.redirect("/"));
  } catch (err) {
    return res.redirect(`/signup?error=${err.message}`);
  }
}

module.exports = { create };

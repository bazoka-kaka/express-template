const User = require("../db/User");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    // clear cookie
    res.clearCookie("jwt", {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });
    return res.sendStatus(204);
  }

  // clear refreshToken from db
  foundUser.refreshToken = "";

  const result = await foundUser.save();

  console.log(result);

  // clear cookie
  res.clearCookie("jwt", {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };

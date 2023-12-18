const usersDB = {
  users: require("../db/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fsPromises = require("fs").promises;

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  const foundUser = usersDB.users.find((person) => person.username == user);
  if (!foundUser) return res.sendStatus(401);

  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    // create jwt
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // save jwt to db
    const currUser = { ...foundUser, refreshToken };
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    usersDB.setUsers([...otherUsers, currUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "db", "users.json"),
      JSON.stringify(usersDB.users)
    );

    // set jwt to cookie
    res.cookie("jwt", refreshToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: false,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };

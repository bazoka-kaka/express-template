const usersDB = {
  users: require("../db/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
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
  const currUser = { ...foundUser, refreshToken: "" };
  const otherUsers = usersDB.users.filter(
    (person) => person.username !== foundUser.username
  );
  usersDB.setUsers([...otherUsers, currUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "db", "users.json"),
    JSON.stringify(usersDB.users)
  );

  // clear cookie
  res.clearCookie("jwt", {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };

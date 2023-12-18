const usersDB = {
  users: require("../db/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const path = require("path");
const fsPromises = require("fs").promises;
const bcrypt = require("bcrypt");

const handleRegister = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409);

  try {
    // hash password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // save new user
    const newUser = {
      username: user,
      roles: {
        User: 2001,
      },
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "db", "users.json"),
      JSON.stringify(usersDB.users)
    );

    res
      .status(201)
      .json({ message: `User ${user} is registered successfully!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleRegister };

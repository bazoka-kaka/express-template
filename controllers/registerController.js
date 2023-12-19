const User = require("../db/User");
const bcrypt = require("bcrypt");

const handleRegister = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  const duplicate = await User.findOne({ username: user }).exec();
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

    const result = await User.create(newUser);

    console.log(result);

    res
      .status(201)
      .json({ message: `User ${user} is registered successfully!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleRegister };

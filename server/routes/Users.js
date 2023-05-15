const express = require("express");
const router = express.Router();
const { Users, Passwords } = require("../models");
const crypto = require("crypto");
const secret = "oSeRxVnEwc0e1DaHtzw7xvddolbDu08u"; //32 char secret
const BloomFilter = require("bloom-filters").BloomFilter;
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

router.post("/createUser", async (req, res) => {
  const { username } = req.body;
  const userCount = await Users.count({ where: { username: username } });
  console.log(userCount);
  if (userCount == 0) {
    await Users.create({
      username: username,
    });
    res.json("Success, user created");
  } else {
    res.json({ error: "Failure to create user, username already exists" });
  }
});

router.post("/addPassword", async (req, res) => {
  const { username, passwords } = req.body;
  const user = await Users.findOne({ where: { username: username } });

  // Define the optimal filter size and number of hash functions
  const numItems = passwords.length;
  const falsePositiveRate = 0.001;
  const filterSize = Math.ceil(
    -(numItems * Math.log(falsePositiveRate)) / Math.pow(Math.log(2), 2)
  );
  const numHashFunctions = Math.round((filterSize / numItems) * Math.log(2));
  // Create the bloom filter
  const filter = new BloomFilter(filterSize, numHashFunctions);

  passwords.forEach((password) => {
    const hashedPassword = hashPassword(password);
    filter.add(hashedPassword);
  });

  const filterContent = filter.saveAsJSON()._filter.content;
  const filterSeed = filter.saveAsJSON()._seed;
  const filterString = JSON.stringify(filter.saveAsJSON());
  console.log(filterString);

  await Passwords.create({
    password: filterContent,
    seed: filterSeed,
    UserId: user.id,
  });

  res.json("Success");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  let accessToken;
  if (user == null) {
    res.json({ error: "User does not exist" });
  } else {
    const passwords = await Passwords.findOne({ where: { UserId: user.id } });
    if (passwords != null) {
      const defaultFilterString = `{"type":"BloomFilter","_size":489,"_nbHashes":10,"_filter":{"size":489,"content":"${passwords.password}"},"_seed":${passwords.seed}}`;
      const filter = BloomFilter.fromJSON(JSON.parse(defaultFilterString));
      if (filter.has(hashPassword(password))) {
        accessToken = sign({ username: user.username, id: user.id }, secret);
        res.json(accessToken);
      }
    }
    if (accessToken == null) {
      res.json({ error: "Wrong username and password combination" });
    }
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

Users.associate = (models) => {
  Users.hasMany(models.Posts, {
    onDelete: "cascade",
  });
};

module.exports = router;

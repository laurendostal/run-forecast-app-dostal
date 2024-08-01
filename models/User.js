const bcrypt = require("bcrypt");
const db = require("../config/connection");

async function findByUsername(username) {
  const [[user]] = await db.query(
    `SELECT * FROM users WHERE username=?`,
    username
  );
  return user;
}

async function checkPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

async function create(username, password) {
  const hashedPass = await bcrypt.hash(password, 10);

  await db.query(`INSERT INTO users (username, password) VALUES (?, ?)`, [
    username,
    hashedPass,
  ]);

  return findByUsername(username);
}

module.exports = {
  create,
  checkPassword,
  findByUsername,
};

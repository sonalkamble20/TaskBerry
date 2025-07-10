const con = require("./db_connect");

async function createTable() {
  let sql = `CREATE TABLE IF NOT EXISTS User (
    UserID INT NOT NULL AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    CONSTRAINT userPK PRIMARY KEY(UserID)
  );`;
  await con.query(sql);
}

// Get all users
async function getAllUsers() {
  let sql = `SELECT * FROM User`;
  const users = await con.query(sql);
  console.log("Fetched users:", users);  // Log users to check if data is fetched correctly
  return users;
}


async function register(user) {
  let existing = await userExists(user.Username);
  if (existing.length > 0) throw Error("Username already exists.");

  let sql = `INSERT INTO User (Username, Password)
             VALUES (?, ?);`;

  await con.query(sql, [user.Username, user.Password]);

  let newUser = await userExists(user.Username);
  return newUser[0];
}

// Login (READ)
async function login(user) {
  let cUser = await userExists(user.username.trim().toLowerCase());

  console.log("User found:", cUser);  // Log the user from DB
  if (!cUser[0]) throw Error("Username does not exist!");
  if (cUser[0].Password !== user.password) throw Error("Password is incorrect!");

  return cUser[0];
}

// Check if username exists
async function userExists(username) {
  let sql = `SELECT * FROM User WHERE Username = ?`;
  return await con.query(sql, [username]);
}

// Export all functions
module.exports = {
  getAllUsers,
  login,
  register
};
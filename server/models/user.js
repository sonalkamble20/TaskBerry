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
createTable();

// Get all users
async function getAllUsers() {
  let sql = `SELECT * FROM User`;
  const users = await con.query(sql);
  return users;
}

async function register(user) {
  // Expecting { Username, Password }
  let existing = await userExists(user.Username);
  if (existing.length > 0) throw Error("Username already exists.");

  let sql = `INSERT INTO User (Username, Password) VALUES (?, ?)`;
  await con.query(sql, [user.Username, user.Password]);

  let newUser = await userExists(user.Username);
  return newUser[0];
}

// Login: DO NOT lowercase the username; match DB exactly
async function login(user) {
  // Expecting { username, password }
  const uname = user.username?.trim();
  if (!uname) throw Error("Username is required.");
  const cUser = await userExists(uname);
  if (!cUser[0]) throw Error("Username does not exist!");
  if (cUser[0].Password !== user.password) throw Error("Password is incorrect!");
  return cUser[0];
}

async function userExists(username) {
  let sql = `SELECT * FROM User WHERE Username = ?`;
  return await con.query(sql, [username]);
}

async function deleteUser(userId) {
  let sql = `DELETE FROM User WHERE UserID = ?`;
  await con.query(sql, [userId]);
  return { message: `User ${userId} deleted` };
}

async function deleteAllUsers() {
  let sql = `DELETE FROM User`;
  await con.query(sql);
  return { message: "All users deleted" };
}

module.exports = {
  getAllUsers,
  register,
  login,
  deleteUser,
  deleteAllUsers
};

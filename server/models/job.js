const con = require("./db_connect");

async function createTable() {
  let sql = `CREATE TABLE IF NOT EXISTS Job (
    JobID INT NOT NULL AUTO_INCREMENT,
    Jobname VARCHAR(255) NOT NULL,
    Description TEXT,
    UserID INT NOT NULL,
    PRIMARY KEY (JobID)
  );`;
  await con.query(sql);
}
createTable();

async function getAllJobsByUser(userId) {
  let sql = `SELECT * FROM Job WHERE UserID = ?`;
  return await con.query(sql, [userId]);
}

async function addJob(job) {
  // job = { jobname, description, userId }
  let sql = `INSERT INTO Job (Jobname, Description, UserID) VALUES (?, ?, ?)`;
  let result = await con.query(sql, [job.jobname, job.description, job.userId]);
  let insertedId = result.insertId;
  let selectSql = `SELECT * FROM Job WHERE JobID = ?`;
  let insertedJob = await con.query(selectSql, [insertedId]);
  return insertedJob[0];
}

async function updateJob(jobId, jobname, description) {
  let sql = `UPDATE Job SET Jobname = ?, Description = ? WHERE JobID = ?`;
  await con.query(sql, [jobname, description, jobId]);
  let updatedSql = `SELECT * FROM Job WHERE JobID = ?`;
  let updated = await con.query(updatedSql, [jobId]);
  return updated[0];
}

async function deleteJob(jobId) {
  let sql = `DELETE FROM Job WHERE JobID = ?`;
  await con.query(sql, [jobId]);
}

module.exports = {
  getAllJobsByUser,
  addJob,
  updateJob,
  deleteJob
};

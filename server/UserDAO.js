'use strict';


const DBmanager = require('./DBmanager');
const crypto = require('crypto');

const db = new DBmanager();

exports.getUser = (email, password) => {
  return new Promise(async (resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    let row = await db.get(sql, [email], true);
    if (row === undefined)
      resolve(422)
      else{
        const user = { id: row.id, username: row.email, name: row.name, time: row.time };
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err)
            reject (err);
          if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
            resolve (false);
          else {
            resolve (user);
          }
        });
      }
  })
};

exports.getUserById = async (id) => {
  try {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const row = await db.get(sql, [id], true);
    if (row === undefined)
      resolve({ error: 'User not found!' });
    const user = { id: row.id, username: row.email, name: row.name, time: row.time };
    return (user);
  } catch (err) {
    throw err;
  }
};
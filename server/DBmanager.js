'use strict';

const { query } = require('express');
const sqlite = require('sqlite3');

class DBmanager {

    constructor() {
        this.db = new sqlite.Database("./courses.db", (err) => { if (err) throw err; });
    }

    get = (sql, params, takeFirst) => {
        try {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(takeFirst ? rows[0] : rows);
                    }
                })
            });
        } catch (err) {
            throw err;
        }
    };

    query = (sql, params) => {
        try {

            return new Promise((resolve, reject) => {
                this.db.run(sql, params, function (err) {
                    if (err) {
                        reject(err);
                    }
                    else
                        resolve({ changes: this.changes, lastID: this.lastID });
                });
            });
        } catch (err) {
            throw (err);
        }
    };

};

module.exports = DBmanager;
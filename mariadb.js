const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'Bookstore',
    password: 'root',
    dateStrings: true
  });
  
  
  
  module.exports = connection;
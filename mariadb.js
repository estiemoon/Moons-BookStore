const mysql = require('mysql2/promise');


const connection = async () =>{
    await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'Bookstore',
            password: 'root',
            dateStrings: true
    })
}
  
module.exports = connection;
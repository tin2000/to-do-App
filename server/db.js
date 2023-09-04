//dotenv là lưu trữ biến môi trường tách biệt với code

//Connection pooling có thể xem là một phương pháp để tạo ra một pool gồm nhiều connection
//và những connection này sẽ được tái sử dụng
// PostgreSQL có một tiến trình “Postmaster”, tiến trình này sẽ tạo ra các kết nối tới database
//Tiến trình này sẽ dùng khoảng 2~3MB trong bộ nhớ, mỗi khi bạn khởi tạo một kết nối tới DB.
const { Pool } = require("pg");
//dotenv đọc tệp .env trên npm rất tốt
//cú pháp sử dụng:require('dotenv').config();
require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// });

// pool.connect((err) => {
//   if (err) throw err;
//   console.log("Connect to PostgreSQL successfully");
// });
pool.on("connect", (client) => {
  client.query(
    "CREATE TABLE IF NOT EXISTS users (email VARCHAR(255) PRIMARY KEY, hashed_password VARCHAR(255))"
  );
  client
    .query(
      "CREATE TABLE IF NOT EXISTS todos ( id VARCHAR(255) PRIMARY KEY,user_email VARCHAR(255),title VARCHAR(30),progress INT,date VARCHAR(300))"
    )

    .catch((err) => console.log(err));
});

module.exports = pool;

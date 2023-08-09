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
  user: process.env.USERNAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
});

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// });

module.exports = pool;

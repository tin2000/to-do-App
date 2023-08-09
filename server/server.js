//toán tử ?? sẽ trả về giá trị đầu tiên nếu nó k là null undefine
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
const pool = require("./db");
const home = require("./routes/home");
//bcrypt mã hóa password và tăng độ bảo mật
const bcrypt = require("bcrypt");
//sử jsonwebtoken để đảm bảo tính toàn vẹn dữ liệu
const jwt = require("jsonwebtoken");
//Simple Usage (Enable All CORS Requests)
app.use(cors());
app.use(express.json());
app.use("/home", home);
//get all todos
app.get("/todos/:userEmail", async (req, res) => {
  //req.params là lấy tham số trên thanh url
  const { userEmail } = req.params;
  console.log(userEmail);
  try {
    const todos = await pool.query(
      "SELECT * FROM todos where user_email = $1",
      [userEmail]
    );
    res.json(todos.rows);
  } catch (err) {
    console.error(err);
  }
});

//create a new todos
app.post("/todos", async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  console.log(user_email, title, progress, date);
  const id = uuidv4();
  try {
    const newToDo = await pool.query(
      `INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`,
      [id, user_email, title, progress, date]
    );
    res.json(newToDo);
  } catch (err) {
    console.error(err);
  }
});

/* const query = {
  text: 'INSERT INTO users(name, email) VALUES($1, $2)',
  values: ['brianc', 'brian.m.carlson@gmail.com'],
}*/
//const res = await client.query('SELECT * FROM users WHERE id = $1', [1])

//edit a new todos
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  try {
    const editToDo = await pool.query(
      "UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5",
      [user_email, title, progress, date, id]
    );
    //trả về đối tượng theo phương thức json
    res.json(editToDo);
  } catch (err) {
    console.error(err);
  }
});

//delete todo
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteToDo = await pool.query("DELETE FROM todos WHERE id = $1;", [
      id,
    ]);
    res.json(deleteToDo);
  } catch (err) {
    console.error(err);
  }
});

//get one users
app.get("/users", async (req, res) => {
  const email = "tin@test.com";
  try {
    const users = await pool.query(`SELECT * FROM users where email = $1`, [
      email,
    ]);
    res.json(users.rows);
  } catch (err) {
    console.error(err);
  }
});

//signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  //thiết lập 10 vòng băm
  const salt = bcrypt.genSaltSync(10);
  //cho password vô và băm
  const hasedPassword = bcrypt.hashSync(password, salt);
  try {
    const signup = await pool.query(
      `INSERT INTO users (email, hashed_password) VALUES($1, $2)`,
      [email, hasedPassword]
    );
    //ts 1 là payload : info email đc encode base64, ts2 payload được mã hóa theo secret
    //ts 3 là thời gian hết hạn của token
    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    res.json({ email, token });
  } catch (err) {
    console.error(err);
    res.json({ detail: err.detail });
  }
});

//login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (!users.rows.length)
      return res.json({ detail: "người dùng không tồn tại!" });

    //so sánh mật khẩu với mật khẩu với mật khẩu đã băm trong cơ sở dữ liệu
    const success = await bcrypt.compare(
      password,
      //khi thực hiện sau câu query thì tìm thấy 1 dòng duy nhất nên chỉ có 1 hàng
      //tương đương với row[0]
      users.rows[0].hashed_password
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    if (success) {
      res.json({ email: users.rows[0].email, token });
    } else {
      res.json({ detail: "đăng nhập thất bại" });
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on PORT  8000`));

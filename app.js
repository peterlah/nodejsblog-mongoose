const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

// DB 연결, schemas/index.js를 통해 DB 연결
const connect = require("./schemas");
connect();

// 라우터 구성
const { indexRouter, postsRouter, usersRouter, authRouter} = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", indexRouter);
app.use("/api", [postsRouter, usersRouter, authRouter]);

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다.");
});

app.listen(port, () => {
  console.log("Server is running. PORT :", port);
});

const express = require("express");
const indexRouter = express.Router();

// 라우터 구성
const postsRouter = require("./posts");
const usersRouter = require("./users");
const authRouter = require("./auth");

indexRouter.get("/", async (req, res) => {
  res.send("index 페이지 입니다.");
});

module.exports = { indexRouter, postsRouter, usersRouter, authRouter };

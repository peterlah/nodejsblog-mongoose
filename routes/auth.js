const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const secretConfig = require("../secret-config.json");

// 스키마 가져오기
const User = require("../schemas/user");

// 시크릿 키 정의
const secretKey = secretConfig.jwtSecret;

// 로그인 API
router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;
  const user = await User.findOne({ nickname });

  if (!user || password !== user.password) {
    return res.status(400).json({
      errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
    });
  }

  try {
    const token = jwt.sign({ userId: user.userId }, secretKey);
    
    res.cookie("Authorization", `Bearer ${token}`, { secure: false }); // JWT를 Cookie로 할당
    res.status(200).json({ token }); // JWT를 Body로 할당
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

module.exports = router;

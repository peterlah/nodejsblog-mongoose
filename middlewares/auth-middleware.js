const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const secretConfig = require("../secret-config.json");

// 시크릿 키 정의
const secretKey = secretConfig.jwtSecret;

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  if (req.cookies === undefined) {
    return res.status(401).json({
      errorMessage: "로그인 후 이용 가능한 기능입니다."
    });
  }

  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") {
    return res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다."
    });
  }

  try {
    const { userId } = jwt.verify(authToken, secretKey);
    const user = await User.findById(userId);
    res.locals.user = user;
    next();
  } catch (err) {
    console.error(err.stack);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다."
    });
  }
};

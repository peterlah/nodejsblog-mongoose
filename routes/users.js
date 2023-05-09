const express = require("express");
const router = express.Router();

const User = require("../schemas/user");

// 회원가입 API
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  // 아이디 유효성 검사
  // 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 만 포함가능
  const idRegex = /^[a-zA-Z0-9]{3,}$/;
  if (!idRegex.test(nickname)) {
    return res.status(400).json({
      errorMessage:
        "아이디는 최소 3자 이상이어야 하며, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)만 사용 가능합니다."
    });
  }

  // 패스워드 유효성 검사
  // 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패
  const pwRegex = new RegExp(`^((?!${nickname}).){4,}$`);
  if (!pwRegex.test(password)) {
    return res.status(400).json({
      errorMessage:
        "비밀번호는 최소 4자 이상이어야 하며, 닉네임과 같은 값이 포함되면 안됩니다."
    });
  }

  // 패스워드와 패스워드 확인 비교
  if (password !== confirmPassword) {
    return res.status(400).json({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다."
    });
  }

  // nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findOne({ nickname });
  if (existsUsers) {
    // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다.
    return res.status(400).json({
      errorMessage: "중복된 닉네임입니다."
    });
  }

  try {
    const user = new User({ nickname, password });
    await user.save();

    res.status(201).json({});
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

module.exports = router;

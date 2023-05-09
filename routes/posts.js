const express = require("express");
const router = express.Router();

// 스키마 가져오기
const Post = require("../schemas/post");

// 인증을 위한 미들웨어 가져오기
const authMiddleware = require("../middlewares/auth-middleware");

// 전체 게시글 목록 조회 API
router.get("/posts", async (req, res) => {
  try {
    const postAll = await Post.find({});
    postAll.sort((a, b) => b.date - a.date);
    return res.json({ data: postAll });

    // // 원본 코드 - _id값을 조회해보기 편하도록 임시로 모든 정보가 나오도록 변경
    // const getPost = postAll.map((value) => {
    // 	return {
    // 		name: value["name"],
    // 		nickname: value["nickname"],
    // 		date: value["date"]
    // 	}
    // })
    // // 작성 날짜 기준 내림 차순 정렬
    // getPost.sort((a,b) => b.date - a.date)
    // return res.json({data: getPost});
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

// 게시글 작성 API
router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const nickname = res.locals.user["nickname"];
    const { name, content } = req.body;
  
    // 현재 시간 객체 생성
    const date = new Date();
    const createPost = await Post.create({ name, nickname, content, date });
    return res.json({ message: "게시글을 생성하였습니다." });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

// 게시글 조회 API
router.get("/posts/:postId", authMiddleware, async (req, res) => {
  const nickname = res.locals.user["nickname"];
  const { postId } = req.params;
  const post = await Post.find({
    $and: [{ nickname }, { _id: postId }],
  });

  if (!post.length) {
    return res.status(404).json({
      errorMessage: "해당 게시글을 찾을 수 없습니다.",
    });
  }
  
  try {
    const getPost = post.map((value) => {
      return {
        name: value["name"],
        nickname: value["nickname"],
        date: value["date"],
        content: value["content"],
      };
    });

    return res.json({ data: getPost });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

// 게시글 수정 API
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const nickname = res.locals.user["nickname"];
  const { postId } = req.params;
  const { name, content } = req.body;

  // 게시글 존재 여부 확인
  const post = await Post.find({
    $and: [{ nickname }, { _id: postId }],
  });
  if (!post.length) {
    return res.status(404).json({
      errorMessage: "해당 게시글을 찾을 수 없습니다.",
    });
  }

  try {
    // 내용 변경
    const putPost = await Post.updateOne(
      {
        _id: postId,
      },
      {
        $set: {
          name: name,
          nickname: nickname,
          content: content,
        },
      }
    );

    return res.json({
      message: "게시글을 수정하였습니다.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

// 게시글 삭제 API
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const nickname = res.locals.user["nickname"];
  const { postId } = req.params;

  // 게시글 존재 여부 확인
  const post = await Post.find({
    $and: [{ nickname }, { _id: postId }],
  });
  if (!post.length) {
    return res.status(404).json({
      errorMessage: "해당 게시글을 찾을 수 없습니다.",
    });
  }

  try {
    // 내용 삭제
    const deletePost = await Post.deleteOne({ _id: postId });
    return res.json({
      message: "게시글을 삭제하였습니다.",
    });
  } catch (error) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

// comments의 라우터 구성
const commentsRouter = require("./comments");
router.use("/posts/:postId", commentsRouter);

// export router/post.js
module.exports = router;

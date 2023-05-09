const express = require("express");
const router = express.Router({ mergeParams: true });

// 스키마 가져오기
const Comment = require("../schemas/comment");
const authMiddleware = require("../middlewares/auth-middleware");

// 댓글 목록 조회 API
router.get("/comments", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentAll = await Comment.find({ postId });
    commentAll.sort((a, b) => b.date - a.date);

    return res.json({
      data: commentAll,
    });

    // 원본 코드 - _id값을 조회해보기 편하도록 임시로 모든 정보가 나오도록 변경
    // const getComment = commentAll.map((value) => {
    // 	return {
    // 		date: value["date"],
    // 		content: value["content"]
    // 	}
    // })
    // getComment.sort((a,b) => b.date - a.date)

    // return res.json({
    // 	data: getComment
    // });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

// 댓글 작성 API
router.post("/comments", authMiddleware, async (req, res) => {
  const postId = req.params.postId;
  const { content } = req.body;

  if (!content.length) {
    return res.status(400).json({
      errorMessage: "댓글 내용을 입력해주세요.",
    });
  }
  
  try {
    // 현재 시간 객체 생성
    const date = new Date();
    const createContent = await Comment.create({ postId, content, date });
  
    return res.json({
      message: "댓글을 생성하였습니다.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

// 댓글 수정 API
router.put("/comments/:commentId", authMiddleware, async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const { content } = req.body;
  
  const CheckId = await Comment.find({
    $and: [{ postId }, { _id: commentId }],
  });
  
  if (!CheckId.length) {
    return res.status(404).json({
      errorMessage: "댓글이 존재하지 않습니다.",
    });
  }
  
  if (!content.length) {
    return res.status(400).json({
      errorMessage: "댓글 내용을 입력해주세요.",
    });
  }

  try {
    // 현재 시간 객체 생성
    const date = new Date();

    const updateComment = await Comment.updateOne(
      {
        $and: [{ postId }, { _id: commentId }],
      },
      {
        $set: {
          content: content,
          date: date,
        },
      }
    );

    return res.json({
      message: "댓글을 수정하였습니다.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

// 댓글 삭제 API
router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  const CheckId = await Comment.find({
    $and: [{ postId }, { _id: commentId }],
  });
  if (!CheckId.length) {
    return res.status(404).json({
      errorMessage: "댓글이 존재하지 않습니다.",
    });
  }

  try {
    const deleteComment = await Comment.deleteOne({
      $and: [{ postId }, { _id: commentId }],
    });

    return res.json({
      message: "댓글을 삭제하였습니다.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      errorMessage: "서버에서 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다."
    })
  }
});

module.exports = router;

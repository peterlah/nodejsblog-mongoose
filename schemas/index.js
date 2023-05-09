// mongoose를 통한 mongodb 연결
const mongoose = require("mongoose");

// 127.0.0.1:27017/{본인의컬랙션명}
const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/lah_db")
    .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;

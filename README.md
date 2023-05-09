# 초기 설정
```
npm init
npm install express / npm i express
npm install mongoose
```

# 서버 설정
우분투 20.04
1. nodejs 설치
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. mongodb 설치
```
sudo apt-get install gnupg
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

sudo service mongod restart
```

3. npm 패키지 설치
```
cd "gitclone해온디렉토리"
npm install
node app.js
```

4. iptables 설정 3000 -> 80
```
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
```

5. pm2 설치
```
sudo -s
npm install -g pm2
<!-- 실행 -->
pm2 start app.js
<!-- 종료 -->
pm2 delete 0 
```

# 디렉토리 구조
```
.
├── app.js
├── routes
│   ├── index.js
│   ├── comments.js
│   └── posts.js
└── schemas<br>
    ├── index.js
    ├── comment.js
    └── post.js
```
- 위와 같은 Directory Structure로 서비스를 구현하기
- Middleware를 이용하여 Router를 분리해주세요.

# API 명세서
별도 엑셀파일 첨부
# 기능 구현
1. 전체 게시글 목록 조회 API
    - 제목, 작성자명, 작성 날짜를 조회하기
    - 작성 날짜 기준으로 내림차순 정렬하기
2. 게시글 작성 API
    - 제목, 작성자명, 비밀번호, 작성 내용을 입력하기
3. 게시글 조회 API
    - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기 
    (검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
4. 게시글 수정 API
    - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기
5. 게시글 삭제 API
    - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기
6. 댓글 목록 조회
    - 조회하는 게시글에 작성된 모든 댓글을 목록 형식으로 볼 수 있도록 하기
    - 작성 날짜 기준으로 내림차순 정렬하기
7. 댓글 작성
    - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
8. 댓글 수정
    - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
9. 댓글 삭제
    - 원하는 댓글을 삭제하기

# 상태코드와 리스폰스 예시
- **200: OK 성공**
- **400: Bad Request(잘못된요청)**
- **404: Not found(찾을수 없음)**
- **4XX: 클라이언트로 인한 오류발생**
- **5XX: 서버로 인한 오류발생**

# 질문
1. 수정, 삭제 API에서 Resource를 구분하기 위해서 Request를 어떤 방식으로 사용하셨나요? (`param`, `query`, `body`)
- param 값이 있다면 해당 값도 db에 같이 저장하여 해당 리소스를 구분하는데 사용
- 비밀번호 일치 여부 확인을 위해 query에 비밀번호 정보를 함께 전달하여 db의 정보와 비교
- body 메시지에 구분이 필요한 리소스의 경우 파라미터로 사용할 Id정보도 함께 포함하여 전달

2. HTTP Method의 대표적인 4가지는 `GET`, `POST`, `PUT`, `DELETE` 가있는데 각각 어떤 상황에서 사용하셨나요?
- GET : READ
- POST : CREATE
- PUT : UPDATE
- DELETE : DELETE

3. RESTful한 API를 설계했나요? 어떤 부분이 그런가요? 어떤 부분이 그렇지 않나요?
- RESTful한 API를 설계했다고 생각합니다.
<br>**잘한점**<br>
- 리소스에 대한 API 명세서를 사전에 설계하여 명세서 대로 만들고자 노력했습니다.
- CRUD 작업을 수행하기 위한 적절한 메소드를 연결하여 구성하였습니다.
- 오류 처리를 위해, 오류 처리 메커니즘을 구현하였습니다.
<br>**잘한점**<br>
- 보안적인 부분은 고려하지 않았습니다.

4. 역할별로 Directory Structure를 분리하였을 경우 어떠한 이점이 있을까요?
- 코드의 가독성이 올라가서 관리하기 편해집니다.



# LV2
# 사전 준비
```
npm install jsonwebtoken cookie-parser
```

#  요구사항
1. 회원 가입 API
    - 닉네임, 비밀번호, 비밀번호 확인을 **request**에서 전달받기
    - 닉네임은 `최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)`로 구성하기
    - 비밀번호는 `최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패`로 만들기
    - 비밀번호 확인은 비밀번호와 정확하게 일치하기
    - 데이터베이스에 존재하는 닉네임을 입력한 채 회원가입 버튼을 누른 경우 "중복된 닉네임입니다." 라는 에러메세지를 **response**에 포함하기

2. 로그인 API
    - 닉네임, 비밀번호를 **request**에서 전달받기
    - 로그인 버튼을 누른 경우 닉네임과 비밀번호가 데이터베이스에 등록됐는지 확인한 뒤, 하나라도 맞지 않는 정보가 있다면 "닉네임 또는 패스워드를 확인해주세요."라는 에러 메세지를 **response**에 포함하기
    - 로그인 성공 시, 로그인에 성공한 유저의 정보를 JWT를 활용하여 클라이언트에게 Cookie로 전달하기

# 기존 요구 사항 변경 점
1. 전체 게시글 목록 조회 API
    - 제목, 작성자명(nickname), 작성 날짜를 조회하기
    - 작성 날짜 기준으로 내림차순 정렬하기
2. 게시글 작성 API
    - 토큰을 검사하여, 유효한 토큰일 경우에만 게시글 작성 가능
    - ~~제목, 작성자명, 비밀번호, 작성 내용을 입력하기~~
    - 제목, 작성 내용을 입력하기
3. 게시글 조회 API
    - 제목, 작성자명(nickname), 작성 날짜, 작성 내용을 조회하기 
    (검색 기능이 아닙니다. 간단한 게시글 조회만 구현해주세요.)
4. 게시글 수정 API
    - 토큰을 검사하여, 해당 사용자가 작성한 게시글만 수정 가능
    - ~~API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기~~
5. 게시글 삭제 API
    - 토큰을 검사하여, 해당 사용자가 작성한 게시글만 삭제 가능
    - ~~API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기~~
6. 댓글 작성 API
    - 로그인 토큰을 검사하여, 유효한 토큰일 경우에만 댓글 작성 가능
    - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
7. 댓글 수정 API
    - 로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 수정 가능
    - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
    - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
8. 댓글 삭제 API
    - 로그인 토큰을 검사하여, 해당 사용자가 작성한 댓글만 삭제 가능
    - 원하는 댓글을 삭제하기
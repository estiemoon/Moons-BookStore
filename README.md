├── app.js
├── config
│   └── package.json
├── controller
│   ├── bookController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── likeController.js
│   ├── orderController.js
│   └── userController.js
├── db
│   └── mariadb.js
├── middlewares
│   ├── auth.js
│   ├── jwt-utils.js
│   ├── refresh.js
│   └── validator.js
├── models
│   ├── bookModel.js
│   ├── cartModel.js
│   ├── likeModel.js
│   ├── orderModel.js
│   └── userModel.js
├── package.json
├── routes
│   ├── books.js
│   ├── carts.js
│   ├── categories.js
│   ├── likes.js
│   ├── orders.js
│   └── users.js
└── services
    ├── bookService.js
    ├── cartService.js
    ├── likeService.js
    ├── orderService.js
    └── userService.js


----
## 도서사이트 API 설계
### users
* 회원가입
* 로그인
* 비밀번호 찾기

### books
* 전체 책 조회
* 개별 책 조회
  
### likes
* 회원별 좋아요 추가, 삭제
  
### carts
* 장바구니 담기
* 장바구니 조회
* 장바구니 삭제
  
### orders
* 장바구니 -> 주문하기
* 주문조회
* 주문정보 상세보기

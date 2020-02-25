const express = require("express");
const passport = require("passport");
const User = require("./models/user");
const Finance = require("./models/finance");
const router = express.Router();
const fs = require('fs');

router.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.get("/",function(req,res){
  var user_info = null;
  console.log(req.user)
  if(!req.user){
      console.log("nologined")
      user_info = [];
  }else{
      console.log("logined")
      user_info = JSON.parse(JSON.stringify(req.user));
  }
  res.json(user_info);
  // if(req.isAuthenticated()){
  //   console.log("logined")
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.json({logincode:"OK"});
  //   // res.render("index",{user:req.user});
  // }else{
  //   console.log("nologin")
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.json({logincode:"NO"});
  //   // User.find().sort({createAt:"descending"})
  //   // .exec(function(err,users){
  //   //   if(err){return next(err);}
  //   //   res.sendFile(__dirname+"/views/index_nologin.html");
  //   //   // res.render("index_nologin",{users:users});
  //   // });
  // }
});


router.get("/signup",function(req,res){
  console.log("signup page")
  if(req.isAuthenticated()){
    res.header("Access-Control-Allow-Origin", "*");
    res.json({logincode:"OK"});
  }
  else{
    res.header("Access-Control-Allow-Origin", "*");
    res.json({logincode:"NO"});
  }
});


router.post("/signup",function(req,res,next){
  console.log("signup req")
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  console.log(username)
  console.log(password)
  User.findOne({username:username},function(err,user){
    if(err){return next(err);}
    if(user){
      console.log("사용자 이미 존재");
      req.flash("error","사용자가 이미 있습니다.");
      return res.redirect("/signup");
    }
    var newUser = new User({
      username:username,
      password:password,
      money:5000000,
      finances:[
        { company_name:"삼성전자",
          amount:0
        },
        { company_name:"카카오",
          amount:0
        },
        { company_name:"HLB",
          amount:0
        },
        { company_name:"삼성SDI",
          amount:0
        },
        { company_name:"남선알미늄",
          amount:0
        },
        { company_name:"SK하이닉스",
          amount:0
        },
        { company_name:"셀트리온",
          amount:0
        },
        { company_name:"제일바이오",
          amount:0
        },
        { company_name:"네이버",
          amount:0
        },
        { company_name:"체시스",
          amount:0
        },
        { company_name:"LG화학",
          amount:0
        },
        { company_name:"젬백스",
          amount:0
        },
        { company_name:"LG디스플레이",
          amount:0
        },
        { company_name:"SK텔레콤",
          amount:0
        },
        { company_name:"셀리버리",
          amount:0
        },
        { company_name:"신라젠",
          amount:0
        },
        { company_name:"알테오젠",
          amount:0
        },
        { company_name:"진바이오텍",
          amount:0
        },
        { company_name:"LG전자",
          amount:0
        },
        { company_name:"엘비세미콘",
          amount:0
        },
        { company_name:"파워로직스",
          amount:0
        },
        { company_name:"NC소프트",
          amount:0
        },
        { company_name:"KT&G",
          amount:0
        },
        { company_name:"삼성전기",
          amount:0
        },
        { company_name:"PSK",
          amount:0
        },  
        { company_name:"드림텍",
          amount:0
        },
        { company_name:"테스나",
          amount:0
        },
        { company_name:"엠씨넥스",
          amount:0
        },
        { company_name:"이크레더블",
          amount:0
        },
        { company_name:"켐트로닉스",
          amount:0
        }
      ]
    });
    newUser.save(next);
  });
},passport.authenticate("login",{
  successRedirect:"/",
  failureRedirect:"/signup",
  failureFlash:true
}));


router.get("/users/:username",function(req,res,next){
  User.findOne({username:req.params.username},function(err,user){
    if(err) {return next(err);}
    if(!user){return next(404);}
    res.render("profile",{user:user});
  });
});


router.get("/login",function(req,res){
  console.log("login page")
  if(req.isAuthenticated()){
    res.header("Access-Control-Allow-Origin", "*");
    res.json({logincode:"OK"});
  }
  else{
    res.header("Access-Control-Allow-Origin", "*");
    res.json({logincode:"NO"});
  }
});


router.post("/login",function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if (err) { return next(err); }
    
    if(user){ // 로그인 성공
      console.log("req.user : "+ JSON.stringify(user));
      var json = JSON.parse(JSON.stringify(user));
      
      // customCallback 사용시 req.logIn()메서드 필수
      req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.send(json);
        });

    }else{	// 로그인 실패
      console.log("/login fail!!!");
      res.send([]);
    }
  })(req, res, next);
})

// passport.authenticate("login",{
//   successRedirect: "/",
//   failureRedirect: "/login",
//   failureFlash : true
// }),
// function(req, res) {	// 콜백함수
//   console.log("req.user : "+ JSON.stringify(req.user));
// });


router.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    next();
  }else{
    req.flash("info","먼저 로그인해야 이 페이지를 볼 수 있습니다.");
    res.redirect("/login");
  }
}

router.get("/finances",function(req,res){
  Finance.find({},function(err,finances){
    const f = {finances:finances};
    res.header("Access-Control-Allow-Origin", "*");
    res.json(f);
  })
})

router.get("/finance",ensureAuthenticated,function(req,res){
  Finance.find({company_name:req.body.company_name},function(err,finance){
    const f = {finance:finance};
    res.json(f);
  })
})

router.get("/buy",ensureAuthenticated,function(req,res){
  let d = new Date();
  let hour = d.getHours()
  let minute = d.getMinutes()

  if((hour>8)&&((hour<16)&&(minute<30))){
    Finance.findOne({company_name:req.body.company_name},function(err,finance){
      const arr = finance["market_price"]
      const temp = arr[arr.length-1].replace(",","")
      // console.log(temp)
      // console.log(Number(temp))
      // console.log(Number(req.body.amount))
      const money = Number(temp)*Number(req.body.amount);
      // console.log(money)
      // console.log(typeof(money))
      User.findOne({username:req.body.username},function(err,user){
        // console.log(user)
        user.buyFinance(money, req.body.company_name,req.body.amount);
      })
      res.json({code:"success"});
    })
  }
  else{
    res.json({code:"fail"});
  }
})

router.get("/sell",ensureAuthenticated,function(req,res){
  let d = new Date();
  let hour = d.getHours()
  let minute = d.getMinutes()
  if((hour>8)&&((hour<16)&&(minute<30))){
    Finance.findOne({company_name:req.body.company_name},function(err,finance){
      const arr = finance["market_price"]
      const temp = arr[arr.length-1].replace(",","")
      // console.log(temp)
      // console.log(Number(temp))
      // console.log(Number(req.body.amount))
      const money = Number(temp)*Number(req.body.amount);
      // console.log(money)
      // console.log(typeof(money))
      User.findOne({username:req.body.username},function(err,user){
        // console.log(user)
        user.sellFinance(money, req.body.company_name,req.body.amount);
      })
      res.json({code:"success"});
    })
  }
  else{
    res.json({code:"fail"});
  }
})
router.get("/profile",function(req,res){
  console.log("profile-routes")
  User.findOne({username:req.body.username},function(err,user){
    res.header("Access-Control-Allow-Origin", "*");
    const u = {user:user}
    res.json(u);
  })
})


// router.get("/img1",function(req,res){
//   fs.readFile("1first-day.jpg",              //파일 읽기
//       function (err, data)
//       {
//           //http의 헤더정보를 클라이언트쪽으로 출력
//           //image/jpg : jpg 이미지 파일을 전송한다
//           //write 로 보낼 내용을 입력
//           console.log("11111")
//           res.writeHead(200, { "Content-Type": "image/jpg" });//보낼 헤더를 만듬
//           console.log(typeof(data))
//           res.end(data);  //클라이언트에게 응답을 전송한다

//       }
//   );
// })



// router.get("/edit",ensureAuthenticated,function(req,res){
//   res.render("edit");
// });

// //put메서드는 현재 html에서 get post만 되니까 post로 일단 구현
// router.post("/edit",ensureAuthenticated,function(req,res,next){
//   req.user.displayName = req.body.displayname;//고쳐야 할 부분입니다!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//   req.user.bio = req.body.bio;//고쳐야 할 부분입니다!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//   req.user.save(function(err){
//     if(err){next(err);return;}
//     req.flash("info","Profile updated!");
//     res.redirect("/edit");
//   });
// });

module.exports = router;

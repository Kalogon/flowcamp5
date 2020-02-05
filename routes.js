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
  if(req.isAuthenticated()){
    console.log("logined")
    res.sendFile(__dirname+"/views/index.html");
    // res.render("index",{user:req.user});
  }else{
    console.log("nologin")
    User.find().sort({createAt:"descending"})
    .exec(function(err,users){
      if(err){return next(err);}
      res.sendFile(__dirname+"/views/index_nologin.html");
      // res.render("index_nologin",{users:users});
    });
  }
});


router.get("/signup",function(req,res){
  console.log("signup page")
  res.sendFile(__dirname+"/views/signup.html");
});


router.post("/signup",function(req,res,next){
  console.log("signup req")
  var username = req.body.username;
  var password = req.body.password;
  console.log(username)
  console.log(password)
  User.findOne({username:username},function(err,user){
    if(err){return next(err);}
    if(user){
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
  res.sendFile(__dirname+"/views/login.html");
});


router.post("/login",passport.authenticate("login",{
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash : true
}));


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

router.get("/finances",ensureAuthenticated,function(req,res){
  Finance.find({},function(err,finances){
    const f = {finances:finances};
    res.json(f);
  })
})

router.get("/finance",ensureAuthenticated,function(req,res){
  Finance.find({company_name:req.body.company_name},function(err,finance){
    const f = {finance:finance};
    res.json(f);
  })
})

router.get("/buy",function(req,res){
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
    res.json();
  })
})

router.get("/profile",function(req,res){
  User.findOne({username:req.body.username},function(err,user){
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

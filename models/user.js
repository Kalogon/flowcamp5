const mongoose = require("mongoose");
const crypto = require('crypto')
const config = require('../config')

const userSchema = mongoose.Schema({
  username: {type:String,required:true,unique:true},
  password: {type:String,required:true},
  money: {type:Number, default:5000000},
  admin: { type: Boolean, default: false },
  finances: [new mongoose.Schema({company_name:String,amount:Number})]
});
 


userSchema.statics.create = function(username, password) {
  const encrypted = crypto.createHmac('sha1', config.secret)
                    .update(password)
                    .digest('base64')

  const user = new this({
      username,
      password: encrypted,
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
  })

  // return the Promise
  return user.save()
}


// find one user by using username
userSchema.statics.findOneByUsername = function(username) {
  return this.findOne({
      username
  }).exec()
}

// verify the password of the User documment
userSchema.methods.verify = function(password) {
  const encrypted = crypto.createHmac('sha1', config.secret)
                    .update(password)
                    .digest('base64')
  console.log(this.password === encrypted)

  return this.password === encrypted
}

userSchema.methods.assignAdmin = function() {
  this.admin = true
  return this.save()
}






userSchema.methods.plusMoney = function(m){
  this.money = this.money + m;
  return this.save()
}

userSchema.methods.minusMoney = function(m){
  this.money = this.money - m;
  return this.save();
}

userSchema.methods.buyFinance = function(m,company_name,amount){
  const f = this.finances;
  this.money = this.money - m;
  for (let i = 0; i<f.length ;i++){
    if(f[i]["company_name"]==company_name){
      console.log("buy");
      console.log(f[i]["amount"])
      console.log(amount)
      this.finances[i]["amount"] = f[i]["amount"] + Number(amount)
      console.log(this.finances[i]["amount"])
      break;
    }
  }
  return this.save();
}

userSchema.methods.sellFinance = function(m,company_name,amount){
  const f = this.finances;
  this.money = this.money + m;
  for (let i = 0; i<f.length ;i++){
    if(f[i]["company_name"]==company_name){
      this.finances[i]["amount"] = f[i]["amount"] - Number(amount)
      break;
    }
  }
  return this.save();
}



var User = mongoose.model("User",userSchema);
module.exports = User;

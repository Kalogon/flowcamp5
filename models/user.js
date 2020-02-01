var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
//해시 알고리즘 적용 회수, 높을수록 보안은 높음 속도는 느려짐
var SALT_FACTOR = 10;
//몽구스 요청하고 필드 정의
var userSchema = mongoose.Schema({
  username: {type:String,required:true,unique:true},
  password: {type:String,required:true},
  createdAt:{type:Date,default:Date.now},
  diplayName: String,
  bio: String,
});
 


//모델에 간단한 메서드 추가
userSchema.methods.name = function(){
  return this.displayName||this.username;
};
//bcrypt를 위한 빈 함수
var noop = function(){};
//모델이 저장되기("save") 전(.pre)에 실행되는 함수
userSchema.pre("save",function(done){
  let user = this;
  if(!user.isModified("password")){
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR,function(err,salt){
    if(err){return done(err);}
    bcrypt.hash(user.password,salt,noop,function(err,hashedPassword){
      if(err){return done(err);}
      user.password = hashedPassword;
      done();
    });
  });
});
// 비밀번호 검사하는 함수
userSchema.methods.checkPassword = function(guess,done){
  bcrypt.compare(guess,this.password,function(err,isMatch){
      done(err,isMatch);
  });
};


var User = mongoose.model("User",userSchema);
module.exports = User;

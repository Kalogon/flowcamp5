const User = require('../../../models/user')
const Finance = require('../../../models/finance')
/* 
    GET /api/user/list
*/

exports.list = (req, res) => {
    // refuse if not an admin
    if(!req.decoded.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }

    User.find({}, '-password').exec()
    .then(
        users=> {
            res.json({users})
        }
    )

}


/*
    POST /api/user/assign-admin/:username
*/
exports.assignAdmin = (req, res) => {
    // refuse if not an admin
    if(!req.decoded.admin) {
        return res.status(403).json({
            message: 'you are not an admin'
        })
    }

    User.findOneByUsername(req.params.username)
    .then(
        user => {
            if(!user) throw new Error('user not found')
            user.assignAdmin()
        }
    ).then(
        res.json({
            success: true
        })
    ).catch(
        (err) => { res.status(404).json({message: err.message})}
    )
}

exports.showProfile = (req,res) => {
    console.log("profile-routes")
    User.findOne({username:req.body.username},function(err,user){
        res.header("Access-Control-Allow-Origin", "*");
        const u = {user:user}
        res.json(u);
    })
}

exports.showFinances = (req,res)=>{
    console.log("finances-routes")
    Finance.find({},function(err,finances){
        const f = {finances:finances};
        res.header("Access-Control-Allow-Origin", "*");
        res.json(f);
    })
}

exports.buy = (req,res)=>{
    console.log("buy-routes")

    let d = new Date();
    let hour = d.getHours()
    let minute = d.getMinutes()
    if(true){
        if(req.body.amount<0){
            res.json({code:"fail"});
        }
        else{
            Finance.findOne({company_name:req.body.company_name},function(err,finance){
                console.log(finance)
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
                    if(err){
                        res.json({code:"fail"});
                    }
                    if(money>user.money){
                        res.json({code:"fail"});
                    }
                    else{
                        user.buyFinance(money, req.body.company_name,req.body.amount);
                        res.json({code:"success"});
                    }
                })
                
            })
        }
        
    }
    else{
    res.json({code:"fail"});
    }
}

exports.sell = (req,res)=>{
    console.log("sell-routes")

    let d = new Date();
    let hour = d.getHours()
    let minute = d.getMinutes()
    if(true){
        if(req.body.amount<0){
            res.json({code:"fail"});
        }
        else{
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
                    const uf = user.finances
                    for(let i=0 ; i<uf.length ; i++){
                        if(uf[i]["company_name"] === req.body.company_name){
                            if(uf[i]["amount"] < req.body.amount){
                                res.json({code:"fail"});
                                break;
                            }
                            else{
                                user.sellFinance(money, req.body.company_name,req.body.amount);
                                res.json({code:"success"});
                                break;
                            }
                        }
                    }
                })
            })
        }
        
    }
    else{
    res.json({code:"fail"});
    }
}

exports.own = (req,res)=>{
    console.log("own-routes")

    
    const output = new Array();

    userdone = async()=>{
        const userfinances = new Array();

        await User.findOne({username:req.body.username},function(err,user){
            const temp = user["finances"]
            for(let i = 0; i<temp.length;i++){
                if(temp[i]["amount"]!=0){
                    userfinances.push(temp[i]["company_name"])
                }
            }
            console.log("userdone")
        })

        return userfinances;
    }

    userdone().then((uf)=>{
        Finance.find({},function(err,finances){
            console.log(uf)
            finances.filter((finance)=>{
                console.log(finance["company_name"])
                if(uf.includes(finance["company_name"])){
                    console.log("다행")
                    output.push(finance)
                }
            })
            console.log("financedone")
            res.json({output:output})
        })
    })
    
}
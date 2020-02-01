const axios = require('axios');
const cheerio = require("cheerio");

let finance = []

const getHtml = async() => {
    try{
        const res = await axios({
            url: "https://finance.naver.com/sise/lastsearch2.nhn",
            method: "GET",
            encoding: "utf-8"
        })
        return res;
    }
    catch(error){
        console.error(error)
    }
}

getHtml().then((html)=>{
    const $ = cheerio.load(html.data);
    const table = $("table.type_5")
    console.log($("head").html())
    let i = 0
    let j = 0
    table.children("tbody").children().not(".type1").each(function(){
        let temp = []
        if($(this).children().length == 1){
            return true;
        }
        for(let k = 0;k<$(this).children().length;k++){
            switch(k){
                case 1:
                    let data1 = $(this).children().eq(k).find("a").text()
                    temp.push(data1)
                    // temp.push($(this).children().eq(k).find("a").text())
                    break;
                case 4:
                    let data2 = $(this).children().eq(k).find("span").text()
                    let data2_sub =  data2.substring(5,data2.length-5)
                    temp.push(data2_sub)
                    // temp.push($(this).children().eq(k).find("span").text())
                    break;
                case 5:
                    let data3 = $(this).children().eq(k).find("span").text()
                    let data3_sub =  data3.substring(5,data3.length-5)
                    temp.push(data3_sub)
                    break;
                default:
                    temp.push($(this).children().eq(k).text())
            }
            j +=1
        }
        console.log(temp)
        i+=1
        finance.push(temp)
    })
    
    console.log(i)
    console.log(j)
});

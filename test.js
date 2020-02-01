const axios = require('axios');
const cheerio = require("cheerio");
const download = require("node-image-downloader")

const urls = ["https://finance.naver.com/item/sise.nhn?code=005930",
            "https://finance.naver.com/item/main.nhn?code=035720",
            "https://finance.naver.com/item/main.nhn?code=028300",
            "https://finance.naver.com/item/main.nhn?code=006400",
            "https://finance.naver.com/item/main.nhn?code=008350",
            "https://finance.naver.com/item/main.nhn?code=000660",
            "https://finance.naver.com/item/main.nhn?code=068270",
            "https://finance.naver.com/item/main.nhn?code=052670",
            "https://finance.naver.com/item/main.nhn?code=035420",
            "https://finance.naver.com/item/main.nhn?code=033250",
            "https://finance.naver.com/item/main.nhn?code=051910",
            "https://finance.naver.com/item/main.nhn?code=082270",
            "https://finance.naver.com/item/main.nhn?code=034220",
            "https://finance.naver.com/item/main.nhn?code=017670",
            "https://finance.naver.com/item/main.nhn?code=268600",
            "https://finance.naver.com/item/main.nhn?code=215600",
            "https://finance.naver.com/item/main.nhn?code=196170",
            "https://finance.naver.com/item/main.nhn?code=086060",
            "https://finance.naver.com/item/main.nhn?code=066570",
            "https://finance.naver.com/item/main.nhn?code=061970",
            "https://finance.naver.com/item/main.nhn?code=047310",
            "https://finance.naver.com/item/main.nhn?code=036570",
            "https://finance.naver.com/item/main.nhn?code=033780",
            "https://finance.naver.com/item/main.nhn?code=009150",
            "https://finance.naver.com/item/main.nhn?code=319660",
            "https://finance.naver.com/item/main.nhn?code=192650",
            "https://finance.naver.com/item/main.nhn?code=131970",
            "https://finance.naver.com/item/main.nhn?code=097520",
            "https://finance.naver.com/item/main.nhn?code=092130",
            "https://finance.naver.com/item/main.nhn?code=089010"]

const getHtml = async(url_c) => {
    try{
        const res = await axios({
            url: url_c,
            method: "GET",
        })
        return res;
    }
    catch(error){
        console.error(error)
    }
}
for(let j = 0;j<urls.length;j++){
    getHtml(urls[j]).then((html)=>{
        let ulList = [];
        const $ = cheerio.load(html.data);

        const today = $("em.no_up span")
        const img = $("div.chart img");
        const imagesrc = img.attr("src")

        console.log(today.text())

        download({
            imgs: [
                {
                    uri:imagesrc
                }
            ],
            dest:'./views'
        }).then((info) => {
            console.log('Download Completed')
        })
    })
}




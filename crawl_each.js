const axios = require('axios');
const cheerio = require("cheerio");
const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const Finance = require("./models/finance");
mongoose.Promise = global.Promise;


const company_name = ["삼성전자","카카오","HLB","삼성SDI","남선알미늄","SK하이닉스","셀트리온","제일바이오","네이버",
                    "체시스","LG화학","젬백스","LG디스플레이","SK텔레콤","셀리버리","신라젠","알테오젠","진바이오텍",
                    "LG전자","엘비세미콘","파워로직스","NC소프트","KT&G","삼성전기","PSK","드림텍","테스나","엠씨넥스",
                    "이크레더블","켐트로닉스"]
const urls = ["https://finance.naver.com/item/sise.nhn?code=005930",
            "https://finance.naver.com/item/sise.nhn?code=035720",
            "https://finance.naver.com/item/sise.nhn?code=028300",
            "https://finance.naver.com/item/sise.nhn?code=006400",
            "https://finance.naver.com/item/sise.nhn?code=008350",
            "https://finance.naver.com/item/sise.nhn?code=000660",
            "https://finance.naver.com/item/sise.nhn?code=068270",
            "https://finance.naver.com/item/sise.nhn?code=052670",
            "https://finance.naver.com/item/sise.nhn?code=035420",
            "https://finance.naver.com/item/sise.nhn?code=033250",
            "https://finance.naver.com/item/sise.nhn?code=051910",
            "https://finance.naver.com/item/sise.nhn?code=082270",
            "https://finance.naver.com/item/sise.nhn?code=034220",
            "https://finance.naver.com/item/sise.nhn?code=017670",
            "https://finance.naver.com/item/sise.nhn?code=268600",
            "https://finance.naver.com/item/sise.nhn?code=215600",
            "https://finance.naver.com/item/sise.nhn?code=196170",
            "https://finance.naver.com/item/sise.nhn?code=086060",
            "https://finance.naver.com/item/sise.nhn?code=066570",
            "https://finance.naver.com/item/sise.nhn?code=061970",
            "https://finance.naver.com/item/sise.nhn?code=047310",
            "https://finance.naver.com/item/sise.nhn?code=036570",
            "https://finance.naver.com/item/sise.nhn?code=033780",
            "https://finance.naver.com/item/sise.nhn?code=009150",
            "https://finance.naver.com/item/sise.nhn?code=319660",
            "https://finance.naver.com/item/sise.nhn?code=192650",
            "https://finance.naver.com/item/sise.nhn?code=131970",
            "https://finance.naver.com/item/sise.nhn?code=097520",
            "https://finance.naver.com/item/sise.nhn?code=092130",
            "https://finance.naver.com/item/sise.nhn?code=089010"]

let finance = new Array();



const getHtml = async(url_c) => {
    try{
        const res = await axios({
            url: url_c,
            method: "GET",
            encoding: "utf-8"
        })
        return res;
    }
    catch(error){
        console.error(error)
    }
}

const parsing = async() => {

    for(let j = 0;j<urls.length;j++){

        await getHtml(urls[j]).then((html)=>{
            let temp = []
            const $ = cheerio.load(html.data);
            $(".tab_con1").children().each(function(index1){
                if(index1!=0){
                    $(this).children("table").each(function(){
                        $(this).children("tbody").each(function(){
                            $(this).children("tr").each(function(){
                                $(this).children("td").each(function(){
                                    $(this).children("span").each(function(){
                                        if($(this).find("em").text()!=""){
                                            temp.push($(this).find("em").text())
                                        }
                                    })
                                    $(this).children("em").each(function(){
                                        temp.push($(this).text())
                                    })
                                })
                            })
                        })
                    })
                }
            });

            temp.push($("#_nowVal").text());
            temp.push($("#_quant").text());
            temp.push($("#_amount").text());
            let finance_json = new Object();
            finance_json.company_name = company_name[j];

            finance_json.market_price = temp[23];
            finance_json.trade_volume = temp[24];
            finance_json.market_cap_rank = temp[1];
            finance_json.listed_stocks = temp[2];
            finance_json.face_value = temp[3];
            finance_json.trading_unit = temp[4];
            finance_json.foreigner_stock_limit = temp[5];
            finance_json.foreigner_stock_possession = temp[6];
            finance_json.foreigner_exhaustion_rate = temp[7];
            finance_json.investing_opinion = temp[8];
            finance_json.target_price = temp[9];
            finance_json.best = temp[10];
            finance_json.worst = temp[11];
            finance_json.per_fn = temp[12];
            finance_json.eps_fn = temp[13];
            finance_json.per_krx = temp[14];
            finance_json.eps_krx = temp[15];
            finance_json.per_expect = temp[16];
            finance_json.eps_expect = temp[17];
            finance_json.pbr = temp[18];
            finance_json.bps = temp[19];
            finance_json.dividend_yield = temp[20];
            finance_json.same_industry_per = temp[21];
            
            finance.push(finance_json);
        });
    }
    return finance;
}
parsing().then((f)=>{
    console.log("real")
    console.log(f)
    Finance.findOne({company_name:company_name[0]},function(err,finance){
        console.log("저장중")
        if(err){
            return err;
        }
        if(finance){
            finance.stackFinance(f[0]);
        }
        else{
            newfinance = new Finance (f[0]);
            newfinance.save();
        }
    })
})

// cron.schedule('1-5 * * * *', () => {
    
// });


var mongoose = require("mongoose");

var financeSchema = mongoose.Schema({
    company_name: [String],
    market_price: [String],
    market_price_all: [[String]],
    trade_volume: [String],
    market_cap_rank : [String],
    listed_stocks : [String],
    face_value: [String],
    trading_unit: [String],
    foreigner_stock_limit: [String],
    foreigner_stock_possession: [String],
    foreigner_exhaustion_rate: [String],
    investing_opinion: [String],
    target_price: [String],
    best: [String],
    worst: [String],
    per_fn: [String],
    eps_fn: [String],
    per_krx: [String],
    eps_krx: [String],
    per_expect: [String],
    eps_expect: [String],
    pbr: [String],
    bps: [String],
    dividend_yield: [String],
    same_industry_per: [String]
});

financeSchema.methods.stackFinance = function (finance){
    this.market_price.push(finance["market_price"])
    this.trade_volume.push(finance["trade_volume"])
    this.market_cap_rank.push(finance["market_cap_rank"])
    this.listed_stocks.push(finance["listed_stocks"])
    this.face_value.push(finance["face_value"])
    this.trading_unit.push(finance["trading_unit"])
    this.foreigner_stock_limit.push(finance["foreigner_stock_limit"])
    this.foreigner_stock_possession.push(finance["foreigner_stock_possession"])
    this.foreigner_exhaustion_rate.push(finance["foreigner_exhaustion_rate"])
    this.investing_opinion.push(finance["investing_opinion"])
    this.target_price.push(finance["target_price"])
    this.best.push(finance["best"])
    this.worst.push(finance["worst"])
    this.per_fn.push(finance["per_fn"])
    this.eps_fn.push(finance["eps_fn"])
    this.per_krx.push(finance["per_krx"])
    this.eps_krx.push(finance["eps_krx"])
    this.per_expect.push(finance["per_expect"])
    this.eps_expect.push(finance["eps_expect"])
    this.pbr.push(finance["pbr"])
    this.bps.push(finance["bps"])
    this.dividend_yield.push(finance["dividend_yield"])
    this.same_industry_per.push(finance["same_industry_per"])
    return this.save();
}

financeSchema.methods.saveprice = function () {
    let price_day = this.price_day;
    this.price_all.push(price_day);
    this.price_day = [];
    return this.save();
};


let Finance = mongoose.model("Finance",financeSchema);
module.exports = Finance;
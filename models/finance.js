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
    return this.save();
}

financeSchema.methods.addprice = function (p) {
    this.price_day.push(p);
    return this.save();
};

financeSchema.methods.saveprice = function () {
    let price_day = this.price_day;
    this.price_all.push(price_day);
    this.price_day = [];
    return this.save();
};


let Finance = mongoose.model("Finance",financeSchema);
module.exports = Finance;
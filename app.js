const express = require("express");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bodyParser = require("body-parser");
const morgan = require('morgan')
const cors = require("cors");

const config = require('./config')
const port = process.env.PORT || 80
// const crawl = require("./crawl_each");


mongoose.connect(config.mongodbUri);
const db = mongoose.connection
db.on('error', console.error)
db.once('open', ()=>{
    console.log('connected to mongodb server')
})


const app = express();
app.use(cors({origin: "http://localhost:3000", credentials:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'))
app.set('jwt-secret', config.secret)

app.get('/', (req, res) => {
  res.send('Hello JWT')
})
// configure api router
app.use('/api', require('./routes/api'))

app.listen(port,function(){
  console.log(`Express is running on port ${port}`);
});
const mongoose=require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/mytalordb";
const Product = require("../models/product.js")
const initData= require("./data.js");

//connecting to the database 
main().then(()=>{
    console.log("connected to db");
}).catch((err)=> console.log(err));
async function main(){
    await mongoose.connect(mongo_url);
}

const initDB = async ()=>{
    await Product.deleteMany({});
    await Product.insertMany(initData.data);
    console.log("data inserted successfully");
}

initDB();
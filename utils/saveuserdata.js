// const mongoose=require("mongoose");
// const mongo_url="mongodb://127.0.0.1:27017/mytalordb";
// const User = require("../models/user.js")
// const userdata= require("./userdata.js");
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';

// //connecting to the database 
// main().then(()=>{
//     console.log("connected to db");
// }).catch((err)=> console.log(err));
// async function main(){
//     await mongoose.connect(mongo_url);
// }

// const initDB = async ()=>{
//     await User.deleteMany({});
//     await User.insertMany(userdata.data);
//     console.log("data inserted successfully");
// }

// initDB();

const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/mytalordb";
const User = require("../models/user.js");
const userdata = require("./userdata.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Connecting to the database
main().then(() => {
    console.log("Connected to DB");
    initDB();  // Run initDB after connecting to the database
}).catch((err) => console.log("Error connecting to DB:", err));

async function main() {
    await mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true });
}

// Initialize DB by deleting old data and inserting new data
const initDB = async () => {
    try {
        // Delete all existing users
        const deleteResult = await User.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} user(s)`);

        // Hash passwords and insert new data
        const usersWithHashedPasswords = await Promise.all(userdata.data.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            return { ...user, password: hashedPassword };  // Update password with hashed version
        }));

        // Insert new data with hashed passwords
        const insertResult = await User.insertMany(usersWithHashedPasswords);
        console.log(`Inserted ${insertResult.length} user(s) successfully`);
    } catch (err) {
        console.error("Error inserting data:", err);
    }
};

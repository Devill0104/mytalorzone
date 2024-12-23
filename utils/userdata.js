// const mongoose = require('mongoose');
// const User = require('../models/user.js'); // adjust the path to your model

// const users = [
//   // Trendy Category Products (Female Wear)
//   {
//     name: "user1",
//     email:"e@e.com",
//     password: "123",
   
//   }
// ]

// module.exports = {data: users};

const users = [
    {
      name: "user1",
      email: "e@e.com",
      password: "123", // Make sure to hash this password before inserting into DB
    }
  ];
  
  module.exports = { data: users };
  
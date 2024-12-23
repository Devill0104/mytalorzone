const mongoose = require('mongoose');
const Product = require('../models/product.js'); // adjust the path to your model

const products = [
  // Trendy Category Products (Female Wear)
  {
    name: "Trendy Crop Top",
    price: "600.99",
    img: "/images/t1.png", // image left empty
    category: "Trendy",
    rating: 4.6,
    productId: "trendy-001",
    inStockValue: 120,
    soldStockValue: 80,
    visibility: "on"
  },
  {
    name: "Trendy Leggings",
    price: "899.99",
    img: "/images/t2.png",
    category: "Trendy",
    rating: 4.3,
    productId: "trendy-002",
    inStockValue: 150,
    soldStockValue: 90,
    visibility: "on"
  },
  {
    name: "Trendy Tunic Top",
    price: "1200.00",
    img: "/images/t3.png",
    category: "Trendy",
    rating: 4.7,
    productId: "trendy-003",
    inStockValue: 90,
    soldStockValue: 60,
    visibility: "on"
  },
  {
    name: "Trendy Peplum Blouse",
    price: "370.50",
    img: "/images/t4.png",
    category: "Trendy",
    rating: 4.4,
    productId: "trendy-004",
    inStockValue: 75,
    soldStockValue: 50,
    visibility: "on"
  },
  {
    name: "Trendy Skater Dress",
    price: "900.99",
    img: "/images/t5.png",
    category: "Trendy",
    rating: 4.8,
    productId: "trendy-005",
    inStockValue: 110,
    soldStockValue: 95,
    visibility: "on"
  },
  {
    name: "Trendy Wrap Dress",
    price: "458.99",
    img: "/images/t6.png",
    category: "Trendy",
    rating: 4.7,
    productId: "trendy-006",
    inStockValue: 100,
    soldStockValue: 65,
    visibility: "on"
  },
  {
    name: "Trendy Cold Shoulder Top",
    price: "560.99",
    img: "/images/t7.png",
    category: "Trendy",
    rating: 4.5,
    productId: "trendy-007",
    inStockValue: 130,
    soldStockValue: 75,
    visibility: "on"
  },
  {
    name: "Trendy Off-Shoulder Blouse",
    price: "290.99",
    img: "/images/t8.png",
    category: "Trendy",
    rating: 4.6,
    productId: "trendy-008",
    inStockValue: 80,
    soldStockValue: 60,
    visibility: "on"
  },

  // Traditional Category Products (Female Wear)
  {
    name: "Traditional Silk Saree",
    price: "3500.00",
    img: "/images/tr1.png",
    category: "Traditional",
    rating: 4.9,
    productId: "traditional-001",
    inStockValue: 50,
    soldStockValue: 20,
    visibility: "on"
  },
  {
    name: "Traditional Cotton Saree",
    price: "7500.00",
    img: "/images/tr2.png",
    category: "Traditional",
    rating: 4.5,
    productId: "traditional-002",
    inStockValue: 60,
    soldStockValue: 30,
    visibility: "on"
  },
  {
    name: "Traditional Chiffon Saree",
    price: "2100.00",
    img: "/images/tr3.png",
    category: "Traditional",
    rating: 4.6,
    productId: "traditional-003",
    inStockValue: 40,
    soldStockValue: 15,
    visibility: "on"
  },
  {
    name: "Traditional Kanjeevaram Saree",
    price: "2200.00",
    img: "/images/tr4.png",
    category: "Traditional",
    rating: 5.0,
    productId: "traditional-004",
    inStockValue: 30,
    soldStockValue: 10,
    visibility: "on"
  },
  {
    name: "Traditional Bandhani Saree",
    price: "8500.00",
    img: "/images/tr5.png",
    category: "Traditional",
    rating: 4.4,
    productId: "traditional-005",
    inStockValue: 45,
    soldStockValue: 25,
    visibility: "on"
  },
  {
    name: "Traditional Linen Saree",
    price: "9500.00",
    img: "/images/tr6.png",
    category: "Traditional",
    rating: 4.7,
    productId: "traditional-006",
    inStockValue: 40,
    soldStockValue: 20,
    visibility: "on"
  },
  {
    name: "Traditional Georgette Saree",
    price: "1100.00",
    img: "/images/tr7.png",
    category: "Traditional",
    rating: 4.6,
    productId: "traditional-007",
    inStockValue: 60,
    soldStockValue: 35,
    visibility: "on"
  },
  {
    name: "Traditional Banarasi Saree",
    price: "1800.00",
    img: "/images/tr8.png",
    category: "Traditional",
    rating: 5.0,
    productId: "traditional-008",
    inStockValue: 20,
    soldStockValue: 10,
    visibility: "on"
  },

  // Western Category Products (Female Wear)
  {
    name: "Western Floral Dress",
    price: "550.00",
    img: "/images/w1.png",
    category: "Western",
    rating: 4.7,
    productId: "western-001",
    inStockValue: 90,
    soldStockValue: 50,
    visibility: "on"
  },
  {
    name: "Western A-Line Dress",
    price: "650.99",
    img: "/images/w2.png",
    category: "Western",
    rating: 4.6,
    productId: "western-002",
    inStockValue: 80,
    soldStockValue: 45,
    visibility: "on"
  },
  {
    name: "Western Maxi Dress",
    price: "750.00",
    img: "/images/w3.png",
    category: "Western",
    rating: 4.8,
    productId: "western-003",
    inStockValue: 70,
    soldStockValue: 35,
    visibility: "on"
  },
  {
    name: "Western Bodycon Dress",
    price: "590.99",
    img: "/images/w4.png",
    category: "Western",
    rating: 4.5,
    productId: "western-004",
    inStockValue: 120,
    soldStockValue: 80,
    visibility: "on"
  },
  {
    name: "Western Shirt Dress",
    price: "800.99",
    img: "/images/w5.png",
    category: "Western",
    rating: 4.4,
    productId: "western-005",
    inStockValue: 110,
    soldStockValue: 60,
    visibility: "on"
  },
  {
    name: "Western Sundress",
    price: "450.00",
    img: "/images/w6.png",
    category: "Western",
    rating: 4.6,
    productId: "western-006",
    inStockValue: 100,
    soldStockValue: 50,
    visibility: "on"
  },
  {
    name: "Western Casual Dress",
    price: "500.00",
    img: "/images/w7.png",
    category: "Western",
    rating: 4.7,
    productId: "western-007",
    inStockValue: 85,
    soldStockValue: 45,
    visibility: "on"
  },
  {
    name: "Western Mini Dress",
    price: "700.00",
    img: "/images/w8.png",
    category: "Western",
    rating: 4.5,
    productId: "western-008",
    inStockValue: 120,
    soldStockValue: 75,
    visibility: "on"
  }
];


// Save the products to the database
// mytalordb.insertMany(products)
//   .then(() => {
//     console.log(" added successfully!");
//   })
//   .catch((error) => {
//     console.error("Error adding products: ", error);
//   });
module.exports = { data: products };
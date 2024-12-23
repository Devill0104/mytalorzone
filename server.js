const express = require('express');
const mongoose = require('mongoose');
const MONGO_URL =  "mongodb+srv://5ddSgTYCnIufVHSR:5ddSgTYCnIufVHSR@cluster0.6l8ejou.mongodb.net/mytalordb?retryWrites=true&w=majority&appName=Cluster0";
const Product = require("./models/product.js")
const app = express();
const path=require("path");
const User = require("./models/user.js")
const Cart = require("./models/cartmodel.js")

var bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended: true}))
app.use('/product', express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // To parse form data

const passport = require('passport');
const expressSession = require('express-session');

app.use(expressSession({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  // Set the 'user' object globally, available in all views
  res.locals.user = req.session.user || null;
  next();
});

app.use(passport.initialize());
app.use(passport.session());



main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Get All Products Route
app.get('/get-product', async (req, res) => {
  try {
    const user = req.session.user;
    const allProducts = await Product.find({});
    res.render("homepage.ejs", {allProducts , user})
    
  } catch (error) {
    res.send(error)
  }
});
app.get("/trending", async (req, res) => {
  try {
    // Query products with the category 'trending'
    const products = await Product.find({ category: "Trendy" });

    // If no products are found, render the page with a message or an empty list
    if (!products || products.length === 0) {
      return res.render("trending.ejs", { products: [], message: "No trending products found." });
    }

    // Render the 'trending' page with the found products
    return res.render("trending.ejs", { products });

  } catch (err) {
    console.error("Error fetching trending products:", err);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/western", async (req, res) => {
  try {
    // Query products with the category 'trending'
    const products = await Product.find({ category: "Western" });


    // If no products are found, render the page with a message or an empty list
    if (!products || products.length === 0) {
      return res.render("western.ejs", { products: [], message: "No  products found." });
    }

    // Render the 'trending' page with the found products
    return res.render("western.ejs", { products });

  } catch (err) {
    console.error("Error fetching trending products:", err);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/traditional", async (req, res) => {
  try {
    // Query products with the category 'trending'
    const products = await Product.find({ category: "Traditional" });


    

    // If no products are found, render the page with a message or an empty list
    if (!products || products.length === 0) {
      return res.render("traditional.ejs", { products: [], message: "No  products found." });
    }

    // Render the 'trending' page with the found products
    return res.render("traditional.ejs", { products });

  } catch (err) {
    console.error("Error fetching trending products:", err);
    return res.status(500).send("Internal Server Error");
  }
});





// Get Product by ID Route
app.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    else {
        res.render("show.ejs", {product});
    }
 
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: 'Error fetching product',
      error: error.message
    });
  }
});


app.get("/login", (req, res)=>{
   
    res.render("login.ejs")
})
app.get("/signup", (req, res)=>{
    
  res.render("signup.ejs")
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and Password are required!');
  }

  try {
    // Find the user by email in the 'users' collection
    const user = await User.findOne({ email: email });
    console.log("user logged in")

    if (!user) {
      return res.status(401).send('User does not exist');
    }

    // Compare the password using bcryptjs
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send('Incorrect password');
    }

    // Store the user session if login is successful
    req.session.user = user;  // Store user data in session
    
    return res.redirect('/get-product');
  } catch (err) {
    console.error('Database error:', err.message); // Log detailed database error
    // return res.status(500).send('Database error!');
  }
});

app.get("/logout",(req,res, next)=>{
  req.logout((err)=>{
      if(err){
          return next(err);
      }else{
          console.log("user logged out")
          res.redirect("/get-product");
      }
  });
});

app.get('/showcart', async (req, res) => {
  try {
    // Ensure the user is logged in (i.e., there is a session)
    if (!req.session.user) {
      return res.redirect('/login'); // Redirect to login if not logged in
    }

    const userId = req.session.user.userId;

    // Find the user and populate the cart with product details
    const user = await User.findOne({ userId }).populate('cart.productId');

    if (!user || !user.cart || user.cart.length === 0) {
      return res.render('showcart', { cart: [] }); // If cart is empty, pass an empty array
    }

    // The cart is already populated with product details, so you can just pass it
    const cart = user.cart; // user.cart already contains product details due to populate

    // Render the showcart page with populated product details
    return res.render('showcart', { cart });

  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).send('Server Error');
  }
});




app.post('/cart-addition/:productId', async (req, res) => {
  // Ensure user is logged in
  if (!req.session.user || !req.session.user.userId) {
    console.log("User not logged in, redirecting to login.");
    return res.redirect('/login'); // Redirect to login page if not logged in
  }

  // Extract the productId from the URL parameter
  const productId = req.params.productId;  // Get productId from the URL params
  let quantity = req.body.quantity ? parseInt(req.body.quantity, 10) : 1;  // Set default quantity to 1 if not provided

  console.log("Product ID:", productId);
  console.log("Quantity:", quantity);

  // Check if productId is provided
  if (!productId) {
    console.error('Product ID is required!');
    return res.status(400).send('Product ID is required!');
  }

  // Check if productId is valid MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    console.error('Invalid Product ID format!');
    return res.status(400).send('Invalid Product ID format!');  // Return a clear error message
  }

  const userId = req.session.user.userId; // Get logged-in user's userId

  try {
    // Find the user based on the userId
    let user = await User.findOne({ userId });

    // If user doesn't exist, return an error
    if (!user) {
      console.error('User not found!');
      return res.status(404).send('User not found!');
    }

    console.log("User found:", user);

    // Ensure that the cart is an array
    if (!Array.isArray(user.cart)) {
      user.cart = [];  // Initialize as an empty array if it is not an array
    }

    // Check if the product already exists in the user's cart
    const existingProduct = user.cart.find(item => {
      if (item.productId) {
        return item.productId.toString() === productId;
      }
      return false;  // Skip if productId is undefined
    });

    if (existingProduct) {
      // If the product already exists in the cart, increment its quantity
      console.log("Product already in cart, updating quantity.");
      existingProduct.quantity += quantity;
    } else {
      // If the product doesn't exist, add it to the cart with the default quantity (1)
      console.log("Adding new product to cart.");
      user.cart.push({ productId, quantity });
    }

    // Save the updated user with the cart information
    await user.save();

    // Redirect to the show cart page with a success message
    console.log("Product added to cart successfully.");
    return res.redirect('/showcart?success=true');  // Pass the success flag in the query string

  } catch (err) {
    console.error('Error adding product to cart:', err);
    return res.status(500).send('Internal Server Error');
  }
});






// app.get('/showcart', async (req, res) => {
//   try {
//     // Ensure the user is logged in (i.e., there is a session)
//     if (!req.session.user) {
//       return res.redirect('/login'); // Redirect to login if not logged in
//     }

//     // Find the cart for the logged-in user
//     const cart = await Cart.findOne({ userId: req.session.user.userId });
//     console.log("cart value is")
//     console.log(cart)

//     if (!cart || cart.productsInCart.length === 0) {
//       return res.render('showcart', { cart: [] }); // If cart is empty, pass empty array
//     }

//     // Populate product details for each item in the cart
//     const cartItemsWithDetails = await Promise.all(cart.productsInCart.map(async (item) => {
//       // Fetch product details by productId
//       const product = await Product.findById(item._id); // Assuming productId is stored here
//       // return {
//       //   name: product.name,
//       //   price: product.price,
//       //   quantity: item.quantity,
//       //   productId: product._id
//       // };
//     }));
//     console.log("cart details is")
//    console.log(cartItemsWithDetails)
//     // Render the cart view with populated product details
//     return res.render('showcart', { cart: cartItemsWithDetails });

//   } catch (err) {
//     console.error("Error fetching cart:", err);
//     return res.status(500).send('Server Error');
//   }
// });



app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password  // password will be hashed automatically before saving (due to the schema hook)
    });

    // Save the new user to the database
    await newUser.save();

    // Store user session after successful signup
    req.session.user = newUser;  // Store user data in session

    // Redirect the user to the homepage after successful signup
    return res.redirect('/get-product');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});





// app.post('/signup', async (req, res) => {
//   const { name, email, password } = req.body;

  

//   try {
//     // Check if the email already exists in the database
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email is already in use.' });
//     }

//     // Create a new user instance
//     const newUser = new User({
//       name,
//       email,
//       password  // password will be hashed automatically before saving (due to the schema hook)
//     });

//     // Save the new user to the database
//     await newUser.save();

//     // Redirect the user to '/get-product' route after successful signup
//     res.redirect('/get-product'); 
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Internal server error.' });
//   }
// });


// Your routes here
app.listen("8080",()=>{
  console.log("server is listening")
})
module.exports = app; // Export the app instead of listening to a port

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const nodemailer = require('nodemailer');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const authRoutes = require('./routes/auth');
// const uuid = require('uuid');
// const bcrypt = require('bcrypt'); // Added bcrypt import
// const Seller = require('./models/seller');
// const adminAuthRoutes = require('./routes/adminauth'); 
// const cartRoutes = require('./routes/cart');
// const complaintsRoutes = require('./routes/complaints');
// const couponRoutes = require('./routes/coupon')
// const Product = require('./models/product');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors({
//   origin: [' http://localhost:5173', 'http://localhost:3000','https://merabestie-orpin.vercel.app','https://merabestie-khaki.vercel.app','https://merabestie.com','https://hosteecommerce.vercel.app'], // Frontend URLs
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));

// app.use(express.json());
// app.use(require('cookie-parser')());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: "a57cb2f7c4a1ef3a8a3c6a5bf213d998812de8fc7bb47da8b7347a92f9ec48d9",
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: "mongodb+srv://ecommerce:ecommerce@ecommerce.dunf0.mongodb.net/",
//       collectionName: 'sessions',
//     }),
//     cookie: {
//       secure: false,
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     },
//   })
// );

// // Routes
// app.use('/auth', authRoutes);
// app.use('/admin', adminAuthRoutes);
// app.use('/cart', cartRoutes);
// app.use('/complaints', complaintsRoutes);
// app.use('/coupon',couponRoutes)

// // MongoDB Connection
// const uri = process.env.MONGO_URI;
// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));


// // Keep-Alive Route
// app.get('/keep-alive', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is up and running'
//   });
// });

// // Get Products by Category Route
// app.post('/product/category', async (req, res) => {
//   try {
//     const { category } = req.body;
    
//     // Normalize the category to handle case variations
//     let normalizedCategory = category.toLowerCase();
//     let searchCategory;

//     // Map normalized categories to their proper display versions
//     switch(normalizedCategory) {
//       case 'gift-boxes':
//       case 'gift boxes':
//         searchCategory = 'Gift Boxes';
//         break;
//       case 'books':
//         searchCategory = 'Books';
//          break;
//       case 'stationery':
//         searchCategory = 'Stationery';
//         break;
//       default:
//         searchCategory = category;
//     }
    
//     const products = await Product.find({ category: searchCategory });

//     res.status(200).json({
//       success: true,
//       products
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching products by category',
//       error: error.message
//     });
//   }
// });

//rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
// // Create Product Route
// app.post('/create-product', async (req, res) => {
//   try {
//     const productData = req.body;
//     const product = new Product(productData);
//     const result = await product.save();
    
//     res.status(201).json({
//       success: true,
//       message: 'Product created successfully',
//       product: result
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error creating product',
//       error: error.message
//     });
//   }
// });


//ddddddddddddddddddddddddddddd
// // Get All Products Route
// app.get('/get-product', async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json({
//       success: true,
//       products
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching products',
//       error: error.message
//     });
//   }
// });


//rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
// // Update Product Visibility Route
// app.put('/update-visibility', async (req, res) => {
//   try {
//     const { productId, visibility } = req.body;

//     // Find and update the product, creating visibility field if it doesn't exist
//     const updatedProduct = await Product.findOneAndUpdate(
//       { productId: productId },
//       { $set: { visibility: visibility } },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Product visibility updated successfully',
//       product: updatedProduct
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating product visibility',
//       error: error.message
//     });
//   }
// });



//rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
// // Get Product by Product ID Route
// app.post('/:productId', async (req, res) => {
//   try {
//     const { productId } = req.body;

//     // Find product by productId
//     const product = await Product.findOne({ productId });

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching product',
//       error: error.message
//     });
//   }
// });

//ddddddddddddddddddddddddddddddddddddddddd
// // Get Product by ID Route
// app.get('/product/:productId', async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const product = await Product.findById(productId);
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       product
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false, 
//       message: 'Error fetching product',
//       error: error.message
//     });
//   }
// });

// // Update Stock Status Route
// app.post('/instock-update', async (req, res) => {
//   try {
//     const { productId, inStockValue, soldStockValue } = req.body;

//     // Find and update the product
//     const updatedProduct = await Product.findOneAndUpdate(
//       { productId: productId },
//       {
//         $set: {
//           inStockValue: inStockValue,
//           soldStockValue: soldStockValue
//         }
//       },
//       { new: true, upsert: false }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Stock status updated successfully',
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating stock status',
//       error: error.message
//     });
//   }
// });

// // Complaints Schema

// // Assign Product ID Route
// app.get('/assign-productid', async (req, res) => {
//   try {
//     // Find all products
//     const products = await Product.find();
    
//     if (products.length === 0) {
//       return res.status(404).send('No products found to assign productIds.');
//     }

//     // Update each product to add a productId
//     const updatedProducts = [];
//     const usedIds = new Set(); // Track used IDs to ensure uniqueness

//     for (const product of products) {
//       let productId;
//       // Generate unique 6 digit number
//       do {
//         productId = Math.floor(100000 + Math.random() * 900000).toString();
//       } while (usedIds.has(productId));
      
//       usedIds.add(productId);

//       const updateResult = await Product.findOneAndUpdate(
//         { _id: product._id },
//         { $set: { productId } },
//         { new: true }
//       );

//       if (updateResult) {
//         updatedProducts.push(updateResult);
//       } else {
//         console.error(`Failed to update product with ID: ${product._id}`);
//       }
//     }

//     // Save all updated products
//     await Promise.all(updatedProducts.map(product => product.save()));

//     res.status(200).json({
//       success: true,
//       message: 'Product IDs assigned successfully',
//       products: updatedProducts
//     });
//   } catch (err) {
//     console.error('Error during product ID assignment:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Error assigning product IDs',
//       error: err.message
//     });
//   }
// });
// // Address Schema
// const addressSchema = new mongoose.Schema({
//   userId: { type: String, unique: true },
//   address: String
// });

// const Address = mongoose.model('Address', addressSchema);

// // Update or Create Address Route
// app.post('/update-address', async (req, res) => {
//   try {
//     const { userId, address } = req.body;

//     // Try to find existing address for user
//     const existingAddress = await Address.findOne({ userId });

//     let result;
//     if (existingAddress) {
//       // Update existing address
//       existingAddress.address = address;
//       result = await existingAddress.save();
//     } else {
//       // Create new address entry
//       const newAddress = new Address({
//         userId,
//         address
//       });
//       result = await newAddress.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Address updated successfully',
//       address: result
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating address',
//       error: error.message
//     });
//   }
// });
// // Order Schema
// const orderSchema = new mongoose.Schema({
//   orderId: String,
//   userId: String,
//   date: String,
//   time: String,
//   address: String,
//   email: String,
//   name: String,
//   productIds: [String],
//   trackingId: String,
//   price: Number
// });

// const Order = mongoose.model('Order', orderSchema);

// // Place Order Route
// // Get All Orders Route
// app.get('/get-orders', async (req, res) => {
//   try {
//     const orders = await Order.find();
    
//     res.status(200).json({
//       success: true,
//       orders
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching orders',
//       error: error.message
//     });
//   }
// });

// // Get User Details Route
// app.get('/get-user', async (req, res) => {
//   try {
//     const users = await mongoose.model('User').find(
//       {}, // Remove filter to get all users
//       '-password' // Exclude only the password field
//     );
    
//     res.status(200).json({
//       success: true,
//       users
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching user details',
//       error: error.message
//     });
//   }
// });

// // Update Account Status Route
// app.put('/update-account-status', async (req, res) => {
//   try {
//     const { userId, accountStatus } = req.body;

//     // Find and update the user, and get the updated document
//     const updatedUser = await mongoose.model('User').findOneAndUpdate(
//       { userId: userId },
//       { accountStatus },
//       { new: true } // This option returns the modified document rather than the original
//     );

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Account status updated successfully',
//       user: {
//         userId: updatedUser.userId,
//         accountStatus: updatedUser.accountStatus
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating account status',
//       error: error.message
//     });
//   }
// });

// const otpStore = new Map();

// app.post('/find-my-order', async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: 'User ID is required'
//       });
//     }

//     // Find orders for this user
//     const orders = await Order.find({ userId });

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No orders found for this user'
//       });
//     }

//     // Function to get product details for each productId
//     const findProductDetails = async (productIds) => {
//       try {
//         const productDetails = [];
        
//         // Make API calls for each productId
//         for (const productId of productIds) {
//           try {
//             const product = await Product.findById(productId);
//             if (product) {
//               productDetails.push(product);
//             }
//           } catch (err) {
//             console.error(`Error fetching product ${productId}:`, err);
//           }
//         }

//         return productDetails;
//       } catch (error) {
//         throw new Error('Error fetching product details: ' + error.message);
//       }
//     };

//     // Get product details for each order
//     const ordersWithProducts = await Promise.all(
//       orders.map(async (order) => {
//         const productDetails = await findProductDetails(order.productIds);
//         return {
//           ...order.toObject(),
//           products: productDetails
//         };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       orders: ordersWithProducts
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error finding orders',
//       error: error.message
//     });
//   }
// });



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
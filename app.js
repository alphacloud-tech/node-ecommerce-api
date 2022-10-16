
const express       = require("express");
const port          = process.env.PORT || 4000;
const app           = express()
const morgan        = require("morgan");
const mongoose      = require("mongoose");
const cors          = require("cors");


require("dotenv/config");
const api = process.env.API_URL
// console.log(api);

const authJwt        = require('./helpers/jwt');
const errorHandler   = require('./helpers/error-handler');


// CORS
app.use(cors());
app.options("*", cors())




//import productRouter
const productRouter     = require('./routes/products');
const categoryRouter    = require('./routes/categories');
const userRouter        = require('./routes/users');
const orderRouter        = require('./routes/orders');


//Middleware 
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))


//Routers
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);



//product schema
// const productSchema = mongoose.Schema({ // schema
//     name: String,
//     image: String,
//     // countInStock: Number
//     countInStock: {
//         type: Number,
//         required: true
//     }
// })
//product Model
// const Product = mongoose.model('Product', productSchema)



//create route riote

// const Product = require('./models/product');



// app.get(`${api}/products`, async (req, res) => {
//     // res.send("hello api")
//     // const product = {
//     //     id: 1,
//     //     name: "hair dresser",
//     //     img: "some url"
//     // }
//     // res.send(product)

//     const productList = await Product.find();
//     if (!productList) {
//         res.status(500).json({success:false})
//     }
//     res.send(productList)
// })

// app.post(`${api}/products`, (req, res) => {
//     // const newProduct = req.body
//     // console.log(newProduct);
//     // res.send(newProduct)
//     const product = new Product({
//         name: req.body.name,
//         image: req.body.image,
//         countInStock: req.body.countInStock
//     })
//     console.log(product.name);
//     // save it to database 
//     product.save()
//         .then(createdProduct => {
//             // console.log(createdProduct);
//             res.status(201).json(createdProduct)
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 error: err,
//                 success: false
//             })
//         })
// })



// mongoose.connect(process.env.CONNECTION_STRING).then(() => {
//     console.log("database connect successfully");
// }).catch((err) => {
//     console.log(err);
// }) 

// mongoose.connect(process.env.CONNECTION_STRING).then(() => {
//     console.log("database connect successfully");
// }).catch((err) => {
//     console.log(err);
// })
 
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // dbName: 'ecom'
    dbName: process.env.DB_NAME
}).then(() => {
    console.log("database connect successfully");
}).catch((err) => {
    console.log(err);
})

app.listen(port, () => {
    console.log(`server is running http://localhost:${port}`);
})

const express           = require("express");
const { Category }      = require("../models/category");
const { Product }       = require("../models/product");

const router            = express.Router();
const mongoose          = require("mongoose");

const multer          = require("multer");
// const upload = multer({ dest: 'uploads/' })

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //   cb(null, 'public/uploads')
    // to validate image type
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type'); // create error in node js

        if (isValid) {
            uploadError = null
        }

      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // const fileName = file.originalname.replace(' ', '-');
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    // console.log('lgossssssss', extension);
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
    //   cb(null, fileName + '-' + Date.now())
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })



router.get(`/`, async (req, res) => {
    // res.send("hello api")
    // const product = {
    //     id: 1,
    //     name: "hair dresser",
    //     img: "some url"
    // }
    // res.send(product)


    
    // http://localhost:3000/api/v1/products?categories="123" "456"

   
    // let filter = []
    let filter = {}

    if (req.query.categories) {
        // const filter = queryPar.split(",")
        filter = {category:req.query.categories.split(",")}
    }

    // const productList = await Product.find({category: filter}).populate("category");
    const productList = await Product.find(filter).populate("category");
    // const productList = await Product.find().select("name image -_id");
    if (!productList) {
        res.status(500).json({success:false})
    }
    res.send(productList)
})

router.get(`/:id`, async (req, res) => {
    par = req.params.id
    Product.findByIdAndRemove(par)
    
    const product = await Product.findById(par).populate("category");
    if (!product) {
        res.status(500).json({success:false})
    }
    res.send(product)
})


router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    // const newProduct = req.body
    // console.log(newProduct);
    // res.send(newProduct)
   
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("invalid category");

    const file = req.file;
    if (!file) return res.status(400).send("No image in the request");

    const fileName = req.file.filename
    // console.log('adams', fileName);
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    // console.log('tofunmi', basePath);
    

    let product = new Product({
        name            : req.body.name,
        description     : req.body.description,
        richDescription : req.body.richDescription,
        // image           : req.body.image,
        // image           : fileName, // http://localhost:4000/public/uploads/abc
        image           : `${basePath}${fileName}`, // http://localhost:4000/public/uploads/abc
        brand           : req.body.brand,
        price           : req.body.price,
        category        : req.body.category,
        countInStock    : req.body.countInStock,
        rating          : req.body.rating,
        numReviews      : req.body.numReviews,
        isFeatured      : req.body.isFeatured
    })
    // console.log(product.name);
    // save it to database 
    product = await product.save()
    
    if (!product) return res.status(500).send("the product cannot be created");
    res.send(product);

})

// update product
router.put(`/:id`,  uploadOptions.single('image'),  async (req, res) => {
    const par = req.params.id;
    // console.log(par);
    Product.findByIdAndRemove(par)
    if (!mongoose.isValidObjectId(par)) {
        return res.status(400).send("invalid product id");
    }

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("invalid category");

    // first find the product in other to update image
    const product = await Product.findById(req.body.category);
    if (!product) return res.status(400).send("invalid product");

    const file = req.file;
    let imagepath;

    if(file) {
        const fileName = req.file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`
    }else {
        imagepath = product.image
    }

    // const product = await Product.findByIdAndUpdate(par, {
    const updateProduct = await Product.findByIdAndUpdate(par, {
        name            : req.body.name,
        description     : req.body.description,
        richDescription : req.body.richDescription,
        // image           : req.body.image,
        image           : imagepath,
        brand           : req.body.brand,
        price           : req.body.price,
        category        : req.body.category,
        countInStock    : req.body.countInStock,
        rating          : req.body.rating,
        numReviews      : req.body.numReviews,
        isFeatured      : req.body.isFeatured
    }, {new: true});
    // if (!product) {
    if (!updateProduct) {
        return res.status(500).json({success:false, message: "the product with given ID could not be update!"})
    }
    // res.send(product);
    res.send(updateProduct);
})


router.delete(`/:id`, (req, res) => {
    const par = req.params.id;
    // console.log(par);
    Product.findByIdAndRemove(par)
    .then(product => {
        if (product) {
            return res.status(200).json({success:true, message: "the product deleted successfully!"})
        }else {
            return res.status(404).json({success:false, message: "the product could not be found!"})
        }
    })
    .catch(err => {
        return res.status(400).json({success:false, error: err})
    })
})


// get product count
router.get(`/get/count`, async (req, res) => {
   
    const productCount = await Product.countDocuments();
    console.log(productCount);

    if (!productCount) {
        return res.status(500).json({success:false})
    }
    return res.send({productCount: productCount})
})

// get featured product count
router.get(`/get/featured/:count?`, async (req, res) => {
   
    const count = req.params.count ? req.params.count : 0;
    console.log('adams', typeof(count));

    const featuredProduct = await Product.find({isFeatured: true}).limit(+count);
    // console.log(featuredProduct);

    if (!featuredProduct) {
        return res.status(500).json({success:false})
    }
    return res.send(featuredProduct)
})

// gallery upload
router.put(`/gallery-upload/:id`,  uploadOptions.array('images', 10),  async (req, res) => {

    const par = req.params.id

    if (!mongoose.isValidObjectId(par)) {
        return res.status(400).send("invalid product id");
    }

    let imagesPaths = [];
    const files = req.files;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if(files) {
        files.map(file => {
            console.log(basePath);
            console.log(file);
            imagesPaths.push(`${basePath}${file.filename}`)
        })
    }

    // console.log(imagesPaths);
    const product = await Product.findByIdAndUpdate(par, {
        images: imagesPaths ,
    }, {new: true});

    if (!product) return res.status(500).send("the product cannot be updated");
    res.send(product);
})

module.exports = router

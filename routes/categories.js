const {Category}        = require("../models/category");
const express           = require("express");
const router            = express.Router();

// find all Category
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();
    if (!categoryList) {
        return res.status(500).json({success:false})
    }
    res.send(categoryList);
})

// find one Category
router.get(`/:id`, async (req, res) => {
    const par = req.params.id;
    console.log(par);
    const category = await Category.findById(par);
    if (!category) {
        return res.status(500).json({success:false, message: "the category with given ID could not be found!"})
    }
    res.send(category);
})



// create Category
router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });

    category = await category.save();

    if (!category) {
        return res.status(404).send("the category cannot be created!")
    }
    res.send(category);
})


// update Category
router.put(`/:id`, async (req, res) => {
    const par = req.params.id;
    // console.log(par);
    const category = await Category.findByIdAndUpdate(par, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    }, {new: true});
    if (!category) {
        return res.status(500).json({success:false, message: "the category with given ID could not be found!"})
    }
    res.send(category);
})


router.delete(`/:id`, (req, res) => {
    const par = req.params.id;
    // console.log(par);
    Category.findByIdAndRemove(par)
    .then(category => {
        if (category) {
            return res.status(200).json({success:true, message: "the category deleted successfully!"})
        }else {
            return res.status(404).json({success:false, message: "the category could not be found!"})
        }
    })
    .catch(err => {
        return res.status(400).json({success:false, error: err})
    })
})


module.exports = router;
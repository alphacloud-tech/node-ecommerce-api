const {Order}        = require("../models/order");
const {OrderItem}        = require("../models/order-item");
const express           = require("express");
const router            = express.Router();
const mongoose          = require("mongoose");


// find all order
router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('user', 'name email phone').sort({'dateOrdered': -1});
    if (!orderList) {
        return res.status(500).json({success:false})
    }
    res.send(orderList);
})

// find one order
router.get(`/:id`, async (req, res) => { 
    const par = req.params.id;
    // console.log(par);
    const order = await Order.findById(par)
    .populate('user', 'name email phone')
    .populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    });

    if (!order) {
        return res.status(500).json({success:false, message: "the order with given ID could not be found!"})
    }
    res.send(order);
}) 



// create order
router.post(`/`, async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })
        // save it in the database
        newOrderItem = await newOrderItem.save()
        
        //return only the order item ids
        return newOrderItem._id
    }))

    const orderItemsIdsResolved = await orderItemsIds
    // console.log(orderItemsIdsResolved); // track order item

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
        const totalPrice = orderItem.product.price * orderItem.quantity;
        console.log('adams', totalPrice);
        return totalPrice;
    }))
    console.log('tofunmi', totalPrices);
    
    const totalPrice = totalPrices.reduce((a,b) => a + b, 0);
    console.log('daniel', totalPrice);

    let order = new Order({
        // orderItems: req.body.orderItems,
        // orderItems: orderItemsIds,
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1, 
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        // totalPrice: req.body.totalPrice,
        totalPrice: totalPrice,
        user: req.body.user,
    });

    order = await order.save();
+9
    if (!order) {
        return res.status(404).send("the order cannot be created!")
    }
    res.send(order);
})


// update order
router.put(`/:id`, async (req, res) => {
    const par = req.params.id;
    // console.log(par);const par = req.params.id;
    // console.log(par);
    Order.findByIdAndRemove(par)

    if (!mongoose.isValidObjectId(par)) {
        return res.status(400).send("invalid order id");
    }

    const order = await Order.findByIdAndUpdate(par, {
        status: req.body.status,
       
    }, {new: true});

    if (!order) {
        return res.status(500).json({success:false, message: "the order with given ID could not be found!"})
    }
    res.send(order);
})


router.delete(`/:id`, (req, res) => {
    const par = req.params.id;
    // console.log(par);
    Order.findByIdAndRemove(par)
    .then(async order => {
        if (order) {
            await order.orderItem.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success:true, message: "the order deleted successfully!"})
        }else {
            return res.status(404).json({success:false, message: "the order could not be found!"})
        }
    })
    .catch(err => {
        return res.status(400).json({success:false, error: err})
    })
})

// get total sales by admin
router.get(`/get/totalsales`, async (req, res) => {
    const totalSales = await Order.aggregate([
        {$group: {_id: null, totalsales : {$sum: '$totalPrice'}}}
    ])
    if (!totalSales) {
        return res.status(400).send('the order sales cannot be generated')
    }
    // res.send({totalSales: totalSales[0].totalsales});
    res.send({totalSales: totalSales.pop().totalsales});
})


// get total number of orders
router.get(`/get/count`, async (req, res) => {
   
    const orderCount = await Order.countDocuments();
    console.log(orderCount);

    if (!orderCount) {
        return res.status(500).json({success:false})
    }
    return res.send({orderCount: orderCount})
})


// get user order history
router.get(`/get/userorders/:userid`, async (req, res) => {

    const userOrderList = await Order.find()
    .populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'
        }
    })
    .sort({'dateOrdered': -1});

    if (!userOrderList) {
        return res.status(500).json({success:false})
    }
    res.send(userOrderList);
})

module.exports = router;
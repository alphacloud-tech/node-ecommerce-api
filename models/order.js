
const mongoose      = require("mongoose")

//create Order schema
const orderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'OrderItem' 
    }],
    shippingAddress1:   {type: String, required: true},
    shippingAddress2:   {type: String, required: true},
    city:   {type: String, required: true},
    zip:   {type: String, required: true},
    country:   {type: String, required: true},
    phone:   {type: String, required: true},
    status:   {type: String, required: true, default: 'Pending'},
    totalPrice:   {type: Number},
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    dateOrdered: {type: Date, default: Date.now},
});

// virtual id 
orderSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
  
orderSchema.set('toJSON', {
    virtuals: true
});


//create Order model
exports.Order =  mongoose.model("Order", orderSchema)

/**
 * 
 {
    'orderItems': [
        {
        'quantity': 3, 
        'product': '631f19a916f35994e0b054e7'
    },
        {
        'quantity': 2, 
        'product': '631f19a916f35994e0b054e7'
    }
    ],
    'shippingAddress1':   '12 lagos',
    'shippingAddress2':   '14 ogun',
    'city':   'ijaye',
    'zip':   '15496',
    'country':   'nigeria',
    'phone':   '08181600051',
    // 'status':   {type: String, required: true, default: 'Pending'},
    // 'totalPrice':   {type: Number},
    'user': '631f19a916f35994e0b054e7',
 }

  {
    "orderItems": [
        {
        "quantity": 3, 
        "product": "631f19a916f35994e0b054e7"
    },
    {
        "quantity": 2, 
        "product": "631f2530d24f4d411694e8f7"
    }
    ],
    "shippingAddress1": "12 lagos",
    "shippingAddress2": "14-18",
    "city": "ijaye",
    "zip": "15496",
    "country": "nigeria",
    "phone":   "08181600051",
    "user": "63299ae707d782ae6485ae64"
 }
 */

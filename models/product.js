const mongoose      = require("mongoose");

//product schema
const productSchema = mongoose.Schema({ // schema
    name: {
        type: String,
        required: true
    },
    description: { // short description
        type: String,
        required: true
    },
    richDescription: {
        type: String,
       default: ''
    },
    image: {
        type: String,
       default: ''
    },
    images: [{
        type: String,
    }],
    brand: {
        type: String,
       default: ''
    },
    price: {
        type: Number,
       default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
    
})

// virtual id 
productSchema.virtual('id').get(function() {
    return this._id.toHexString();
  });
  
productSchema.set('toJSON', {
    virtuals: true
  });


// productSchema.method('toJSON', function() {
//     var obj = this.toObject();

//     //Rename fields
//     obj.id = obj._id;
//     delete obj._id;
//     delete obj.__v;

//     return obj;
// });


//product Model
exports.Product = mongoose.model('Product', productSchema)

const mongoose      = require("mongoose")

//create OrderItem schema
const orderItemSchema = mongoose.Schema({
   
    quantity:   {type: Number, required: true},
    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product'
    },
    
});

// virtual id 
orderItemSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
  
orderItemSchema.set('toJSON', {
    virtuals: true
});

//create OrderItem model
exports.OrderItem =  mongoose.model("OrderItem", orderItemSchema)

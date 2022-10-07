const mongoose      = require("mongoose");

//product schema
const userSchema = mongoose.Schema({ // schema
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    passwordHash: { 
        type: String,
        required: true
    },
    phone: { 
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    street: {
        
        type: String,
       default: ''
    },
    apartment: {
        type: String,
       default: ''
    },
    zip: {
        type: String,
       default: ''
    },
    city: {
        type: String,
       default: ''
    },
    country: {
        type: String,
       default: ''
    },
    
})

// virtual id 
userSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
  
userSchema.set('toJSON', {
    virtuals: true
});


//product Model
exports.User = mongoose.model('User', userSchema)
exports.userSchema = userSchema
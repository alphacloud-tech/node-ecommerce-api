const mongoose      = require("mongoose");

//product schema
const categorySchema = mongoose.Schema({ // schema
    name: {
        type: String,
        required: true
    },
    icon: { 
        type: String,
    },
    color: { // #00000
        type: String,
    },
    // image: {
    //     type: String,
    //    default: ''
    // },
    
    // dateCreated: {
    //     type: Date,
    //     default: Date.now,
    // }
})

// virtual id 
categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});
  
categorySchema.set('toJSON', {
    virtuals: true
});


// categorySchema.method('toClient', function() {
// categorySchema.method('toJSON', function() {
//     var obj = this.toObject();

//     //Rename fields
//     obj.id = obj._id;
//     delete obj._id;
//     delete obj.__v;

//     return obj;
// });

//product Model
exports.Category = mongoose.model('Category', categorySchema)
const mongoose = require('mongoose');

// Define the Order schema
const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shipping_details: {
        type: Object,
        required: true
    },
    product_details: [{
        type : Object,
        required : true
    }],
    order_total: {
        type: Number,
        required: true
    },
    payment_method: {
        type: Number,
        enum: [1, 2],
        // 1 : COD, 2: Online payment
        required: true
    },
    order_status: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7],
        // 
        default : 1
    },
    transaction_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    },
}, {
    timestamps : true
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

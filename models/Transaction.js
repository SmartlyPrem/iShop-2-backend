const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Transaction schema
const transactionSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: Number, enum: [1, 2], required: true },
    payment_status: { type: Boolean, default: false },
    razorpay_response: { type: Object, default: null }
},
{timestamps : true});

// Create Transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

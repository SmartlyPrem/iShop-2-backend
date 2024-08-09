const Order = require("../models/Order");
const CartModel = require("../models/Cart");
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require("../models/Transaction");

var instance = new Razorpay({
    key_id: 'rzp_test_2cBbihgiE7gQdd',
    key_secret: 'IQGv5gpSzCgtpZQhcRALN0EW',
});

class OrderCtr {
    generateHmacSHA256(data, key) {
        const hmac = crypto.createHmac('sha256', key);
        hmac.update(data);
        return hmac.digest('hex');
    }

    // Function to verify payment signature
    verifyPaymentSignature(orderId, paymentId, providedSignature, secret = "IQGv5gpSzCgtpZQhcRALN0EW") {
        const message = `${orderId}|${paymentId}`;
        const generatedSignature = this.generateHmacSHA256(message, secret);

        return generatedSignature === providedSignature;
    }

    placeOrder({ user_id, payment_method, order_total, product_details, shipping_details }) {
        return new Promise(
            (res, rej) => {
                try {
                    const order = new Order({
                        user_id,
                        product_details,
                        shipping_details,
                        payment_method,
                        order_total
                    })
                    order.save()
                        .then(
                            async (success) => {
                                if (payment_method == 2) {
                                    // create an order on razorpay
                                    var options = {
                                        amount: order_total * 100,  // amount in the smallest currency unit
                                        currency: "INR",
                                        receipt: order._id
                                    };
                                    instance.orders.create(options,
                                        async function (err, razor_order) {
                                            if (err) {
                                                rej({
                                                    msg: "Unable to place order",
                                                    status: 0
                                                })
                                            } else {
                                                res({
                                                    order_id: order._id,
                                                    msg: "Order placed",
                                                    status: 1,
                                                    razor_order
                                                })
                                            }
                                        });
                                } else {
                                    await CartModel.deleteMany({ user_id: user_id })
                                    res({
                                        order_id: order._id,
                                        msg: "Order placed",
                                        status: 1
                                    })
                                }
                            }
                        ).catch(
                            (error) => {
                                rej({
                                    order_id: null,
                                    msg: "Order not place",
                                    status: 0
                                })
                            }
                        )
                } catch (err) {
                    rej({
                        msg: "intranal server error mine",
                        status: 0
                    })
                }
            }
        )
    }

    payment_success({ order_id, razorpay_response = null, user_id }) {
        return new Promise(
            async (res, rej) => {
                try {
                    const isPaymentValid = this.verifyPaymentSignature(razorpay_response.razorpay_order_id, razorpay_response.razorpay_payment_id, razorpay_response.razorpay_signature);
                    if (isPaymentValid) {
                        const orderDetails = await Order.findById(order_id);
                        const transaction = new Transaction({
                            order_id,
                            user_id: orderDetails.user_id,
                            amount: orderDetails.order_total,
                            type: orderDetails.payment_method,
                            payment_status: true,
                            razorpay_response
                        })
                        transaction.save()
                            .then(
                                async () => {
                                    await CartModel.deleteMany({ user_id: user_id });
                                    await Order.updateOne({ _id: order_id }, {
                                        transaction_id: transaction._id,
                                        order_status: 2
                                    });
                                    res({
                                        msg: "Order Placed",
                                        status: 1,
                                        order_id
                                    })
                                }
                            ).catch(
                                (err) => {
                                    rej({
                                        msg: "Order can't place",
                                        status: 0
                                    })
                                }
                            )
                    } else {
                        rej({
                            msg: "Invalid payment signature",
                            status: 0
                        })
                    }
                } catch (err) {
                    rej({
                        msg: "intranal server error mine",
                        status: 0
                    })
                }
            }
        )
    }

    paymentFailed({ order_id, razorpay_response }) {
        return new Promise(
            async (res, rej) => {
                try {
                    const orderDetails = await Order.findById(order_id);
                    const transaction = new Transaction({
                        order_id,
                        user_id: orderDetails.user_id,
                        amount: orderDetails.order_total,
                        type: orderDetails.payment_method,
                        payment_status: false,
                        razorpay_response
                    })
                    transaction.save()
                        .then(
                            () => {
                                res({
                                    msg: "Order payment failed",
                                    status: 0,
                                    order_id
                                })
                            }
                        ).catch(
                            (err) => {
                                rej({
                                    msg: "Order can't place",
                                    status: 0
                                })
                            }
                        )
                } catch (err) {
                    rej({
                        msg: "intranal server error mine",
                        status: 0
                    })
                }
            }
        )
    }

    getOrders(url_query) {
        return new Promise(
            async (res, rej) => {
                try {
                    const query = {};
                    if (url_query.order_id != "null" && url_query.order_id != null) {
                        query._id = url_query.order_id
                    }
                    if (url_query.user_id != "null" && url_query.user_id != null) {
                        query.user_id = url_query.user_id
                    }
                    const orders = await Order.find(query).populate(['user_id', 'transaction_id']);
                    res({
                        msg: "Orders",
                        total: orders.length,
                        status: 1,
                        orders,
                        ProdImgPath: "/images/product/"
                    })
                } catch (err) {
                    rej({
                        msg: "intranal server error mine",
                        status: 0
                    })
                }
            }
        )
    }

    cancelOrder(id) {
        return new Promise(
            async (res, rej) => {
                try {
                    console.log("order ctr id", id);
                    Order.deleteOne({ _id: id })
                        .then(
                            (success) => {
                                res({
                                    msg: "order deleted",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                rej({
                                    msg: "can't delete",
                                    status: 0
                                })
                            }
                        )

                } catch (err) {
                    rej({
                        msg: 'Internal Server error of mine',
                        status: 0
                    })
                }
            }
        )
    }
}

module.exports = OrderCtr;
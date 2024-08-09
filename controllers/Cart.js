const CartModel = require("../models/Cart");

class CartCtr {
    changeQty({ user_id, pId, newQty }) {
        return new Promise(
            async (res, rej) => {
                try {
                    await CartModel.updateOne({ user_id: user_id, pId: pId }, { qty: newQty });
                    res({
                        msg: "qty changed",
                        status: 1
                    })
                } catch (err) {
                    rej({
                        msg: "Internal server error of mine",
                        status: 0
                    })
                }
            }
        )
    }

    stateToCart(user_id, { state_cart }) {
        return new Promise(
            async (res, rej) => {
                try {
                    for (let sc of state_cart) {
                        const existingCart = await CartModel.findOne({ pId: sc.pId, user_id: user_id });
                        if (existingCart) {
                            await CartModel.updateOne({ _id: existingCart._id }, {
                                qty: sc.qty + existingCart.qty
                            })
                        } else {
                            await new CartModel({
                                user_id: user_id,
                                pId: sc.pId,
                                qty: sc.qty
                            }).save()
                        }
                    }
                    const userCart = await CartModel.find({ user_id: user_id }).populate("pId");
                    res({
                        msg: "success",
                        status: 1,
                        userCart
                    })
                } catch (err) {
                    rej({
                        msg: "Internal server error of mine",
                        status: 0
                    })
                }
            }
        )
    }

    addToCart(data) {
        return new Promise(
            async (res, rej) => {
                try {
                    const currentCart = await CartModel.findOne({ user_id: data.user_id, pId: data.pId });
                    if (currentCart) {
                        await CartModel.updateOne({ _id: currentCart._id }, { qty: currentCart.qty + 1 });
                    } else {
                        const cart = new CartModel({ user_id: data.user_id, pId: data.pId, qty: 1 });
                        cart.save()
                            .then(
                                () => {
                                    res({
                                        msg: "done",
                                        status: 1
                                    })
                                }
                            ).catch(
                                () => {
                                    rej({
                                        msg: "not done",
                                        status: 0
                                    })
                                }
                            )
                    }
                } catch (err) {
                    rej({
                        msg: "Internal server error of mine",
                        status: 0
                    })
                }
            }
        )
    }

    deleteFromCart({ user_id, pId }) {
        return new Promise(
            (res, rej) => {
                try {
                    CartModel.deleteOne({ user_id: user_id, pId: pId })
                        .then(
                            () => {
                                res({
                                    msg: "Delete data",
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                rej({
                                    msg: "Not deleted",
                                    status: 0
                                })
                            }
                        )
                } catch (err) {
                    rej({
                        msg: "Internal server error of mine",
                        status: 0
                    })
                }
            }
        )
    }

}

module.exports = CartCtr;
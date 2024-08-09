const { Router } = require('express');
const CartCtr = require('../controllers/Cart');
const CartRouter = Router();

CartRouter.post(
    "/state-to-cart/:user_id",
    (req, res) => {
        const result = new CartCtr().stateToCart(req.params.user_id, req.body);
        result.then(
            (success) => {
                res.send(success)
            }
        ).catch(
            (error) => {
                res.send(error)
            }
        )
    }
)

CartRouter.put(
    "/change-qty",
    (req, res) => {
        const result = new CartCtr().changeQty(req.body);
        result.then(
            (success) => {
                res.send(success)
            }
        ).catch(
            (error) => {
                res.send(error)
            }
        )
    }
)

CartRouter.post(
    "/add-to-cart",
    (req, res) => {
        const result = new CartCtr().addToCart(req.body);
        result.then(
            (success) => {
                res.send(success)
            }
        ).catch(
            (error) => {
                res.send(error)
            }
        )
    }
)

CartRouter.post(
    "/remove-from-cart",
    (req, res) => {
        const result = new CartCtr().deleteFromCart(req.body);
        result.then(
            (success) => {
                res.send(success)
            }
        ).catch(
            (error) => {
                res.send(error)
            }
        )
    }
)

module.exports = CartRouter;
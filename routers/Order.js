const {Router} = require('express');
const OrderCtr = require('../controllers/Order');
const adminAuth = require('../middleware/adminAuth');

const OrderRouter = Router();

OrderRouter.post(
    "/place-order",
    (req, res)=>{
        const result = new OrderCtr().placeOrder(req.body);
        result.then(
            (success)=>{
                res.send(success)
            }
        ).catch(
            (error)=>{
                res.send(error)
            }
        )
    }
)

OrderRouter.post(
    "/payment-success",
    (req, res)=>{
        const result = new OrderCtr().payment_success(req.body);
        result.then(
            (success)=>{
                res.send(success)
            }
        ).catch(
            (error)=>{
                res.send(error)
            }
        )
    }
)

OrderRouter.post(
    "/payment-failed",
    (req, res)=>{
        const result = new OrderCtr().paymentFailed(req.body);
        result.then(
            (success)=>{
                res.send(success)
            }
        ).catch(
            (error)=>{
                res.send(error)
            }
        )
    }
)

OrderRouter.get(
    "/get-orders",
    (req, res)=>{
        const result = new OrderCtr().getOrders(req.query);
        result.then(
            (success)=>{
                res.send(success)
            }
        ).catch(
            (error)=>{
                res.send(error)
            }
        )
    }
)

OrderRouter.delete(
    "/delete-order/:id",
    adminAuth,
    (req, res)=> {
        const result = new OrderCtr().cancelOrder(req.params.id);
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

module.exports = OrderRouter;
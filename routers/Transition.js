const {Router} = require('express');
const TransitionCtr = require('../controllers/Transition')

const TransitionRouter = Router();

TransitionRouter.get(
    "/get-transaction",
    (req, res) => {
        const result = new TransitionCtr().transitionData(req.query);
        result.then(
            (success) => {
                res.send(success);
            }
        ).catch(
            (error) => {
                res.send(error);
            }
        );
    }
)

module.exports = TransitionRouter;

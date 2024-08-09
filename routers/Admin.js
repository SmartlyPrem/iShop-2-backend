const {Router} = require('express');
const AdminCtrl = require('../controllers/Admin');
const adminAuth = require('../middleware/adminAuth');
const AdminRouter = Router();

AdminRouter.post(
    "/sign-in",
    (req, res) => {
        const result = new AdminCtrl().signIn(req.body);
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

AdminRouter.post(
    "/create-author",
    adminAuth,
    (req, res) => {
        const result = new AdminCtrl().createAuthor(req.body);
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

module.exports = AdminRouter;
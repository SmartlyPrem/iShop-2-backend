const { Router } = require('express');
const UserCtr = require('../controllers/User');
const fileUpload = require('express-fileupload');

const UserRouter = Router();

UserRouter.post(
    "/register",
    (req, res) => {
        const result = new UserCtr().register(req.body);
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

UserRouter.post(
    "/login",
    (req, res)=>{
        const result = new UserCtr().login(req.body);
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

UserRouter.get(
    "/get-user/:user_id?",
    (req, res)=>{
        const result = new UserCtr().getUser(req.params.user_id);
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

UserRouter.put(
    "/edit-user/:user_id",
    fileUpload(
        {
            createParentPath: true
        }
    ),
    (req, res) => {
        let image = null;
        if (req.files?.image) {
            image = req.files.image;
        }
        const result = new UserCtr().editUser(req.params.user_id, req.body, image);
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

UserRouter.delete(
    "/delete-user/:user_id",
    (req, res) => {
        const result = new UserCtr().deleteUser(req.params.user_id);
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

UserRouter.patch(
    "/deactivate-user/:user_id",
    (req, res) => {
        const result = new UserCtr().deactivateUser(req.params.user_id);
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

module.exports = UserRouter;
const express = require('express');
const ProdcutController = require('../controllers/Product');
const fileUpload = require('express-fileupload')

const ProductRouter = express.Router();

ProductRouter.get(
    "/get-product/:id?",
    (req, res) => {
        const result = new ProdcutController().read(req.params.id, req.query);
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

ProductRouter.post(
    "/create",
    fileUpload({
        createParentPath: true
    }),
    (req, res) => {
        const result = new ProdcutController().create(req.body, req.files.image);
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

ProductRouter.delete(
    "/delete/:id",
    (req, res) => {
        const result = new ProdcutController().delete(req.params.id);
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

ProductRouter.patch(
    "/change-status/:id",
    (req, res) => {
        const result = new ProdcutController().changeStatus(req.params.id, req.body);
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

ProductRouter.patch(
    "/change-selling/:id",
    (req, res) => {
        const result = new ProdcutController().change_seller(req.params.id, req.body);
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

ProductRouter.put(
    "/update/:id",
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
        const result = new ProdcutController().update(req.params.id, req.body, image)
        result.then(
            (success) => {
                res.send(success)
            }
        ).catch(
            (err) => {
                res.send(err)
            }
        )
    }
)

ProductRouter.get(
    "/best-selling",
    (req, res) => {
        const result = new ProdcutController().best_selling();
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


module.exports = ProductRouter;
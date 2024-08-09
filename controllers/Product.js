const PorductModel = require("../models/Product");
const Category = require("../models/Category");
const fs = require('fs');
const { unlinkSync } = require('fs');

class ProdcutController {
    read(id, query) {
        return new Promise(
            async (res, rej) => {
                try {
                    const dbQuery = {};
                    if(query.category_slug){
                        const category = await Category.findOne({slug : query.category_slug});
                        if(category != null){
                            dbQuery.category = category._id;
                        }
                    };
                    if (query.color != "null"){
                        dbQuery.color = query.color;
                    }
                    let product = [];
                    if (id) {
                        product = await PorductModel.findById(id).populate(['category', 'color']);
                    } else {
                        if (query.limit != 0) {
                            product = await PorductModel.find(dbQuery).populate(['category', 'color']).limit(query.limit)
                        } else {
                            product = await PorductModel.find(dbQuery).populate(['category', 'color']);
                        }
                    }
                    res({
                        product,
                        msg: "Product found",
                        imagePath: "/images/product/",
                        status: 1
                    })
                } catch (err) {
                    rej({
                        msg: "Internal server error of product com",
                        status: 0
                    })
                }
            }
        )
    }

    create(data, image) {
        return new Promise(
            (res, rej) => {
                try {
                    const imageName = new Date().getTime() + Math.floor(Math.random() * 1000) + image.name;
                    const destination = "./public/images/product/" + imageName;
                    image.mv(
                        destination,
                        (err) => {
                            if (err) {
                                rej({
                                    msg: "Unable to add image",
                                    status: 0
                                })
                            } else {
                                const product = new PorductModel({
                                    name: data.name,
                                    slug: data.slug,
                                    price: data.price,
                                    discount_per: data.discount_Per,
                                    discount_price: data.discount_price,
                                    image: imageName,
                                    category: data.category,
                                    color: JSON.parse(data.color)
                                });
                                product.save()
                                    .then(
                                        (success) => {
                                            res({
                                                msg: "Data added successfully",
                                                status: 1
                                            })
                                        }
                                    ).catch(
                                        (error) => {
                                            rej({
                                                msg: "Unable to add data",
                                                status: 0
                                            })
                                        }
                                    )
                            }
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

    delete(id) {
        return new Promise(
            async (res, rej) => {
                try {
                    const currendProd = await PorductModel.findById(id);
                    fs.unlinkSync('./public/images/product/' + currendProd.image)
                    await PorductModel.deleteOne({ _id: id })
                        .then(
                            (success) => {
                                res({
                                    msg: "Product data deleted",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                rej({
                                    msg: "Unable to delete data",
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

    changeStatus(id, data) {
        return new Promise(
            (res, rej) => {
                try {
                    PorductModel.updateOne({ _id: id }, { status: data.status })
                        .then(
                            (success) => {
                                res({
                                    msg: "Product status changed",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                rej({
                                    msg: "Unable to change status",
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

    change_seller(id, data) {
        return new Promise(
            (res, rej) => {
                try {
                    PorductModel.updateOne({ _id: id }, { best_seller: data.status })
                        .then(
                            (success) => {
                                res({
                                    msg: "best seller is choosed",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                rej({
                                    msg: "Unable to change best seller",
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

    update(id, data, image) {
        return new Promise(
            (res, rej) => {
                try {
                    if (image == null) {
                        PorductModel.updateOne({ _id: id }, {
                            name: data.name,
                            slug: data.slug,
                            price: data.price,
                            discount_per: data.discount_Per,
                            discount_price: data.discount_price,
                            category: data.category,
                            color: JSON.parse(data.color)
                        })
                            .then(
                                (success) => {
                                    res({
                                        msg: "Data Updated",
                                        status: 1
                                    })
                                }
                            ).catch(
                                () => {
                                    rej({
                                        msg: "Data unable to update",
                                        status: 0
                                    })
                                }
                            )
                    } else {
                        const newImage = new Date().getTime() + Math.floor(Math.random() * 1000) + image.name;
                        const destination = "./public/images/product/" + newImage;
                        image.mv(
                            destination,
                            async (err) => {
                                if (!err) {
                                    await PorductModel.updateOne({ _id: id }, {
                                        name: data.name,
                                        slug: data.slug,
                                        price: data.price,
                                        discount_per: data.discount_Per,
                                        discount_price: data.discount_price,
                                        image: newImage,
                                        category: data.category,
                                        color: JSON.parse(data.color)
                                    })
                                        .then(
                                            (success) => {
                                                unlinkSync(`./public/images/product/${data.oldImage}`)
                                                res({
                                                    msg: "Data Updated",
                                                    status: 1
                                                })
                                            }
                                        ).catch(
                                            (error) => {
                                                rej({
                                                    msg: "Data unable to update with image",
                                                    status: 0
                                                })
                                            }
                                        )
                                } else {
                                    rej({
                                        msg: "Unable to upload image",
                                        status: 0
                                    })
                                }
                            }
                        )
                    }
                } catch (err) {
                    rej({
                        msg: "Internal server error",
                        status: 0
                    })
                }
            }
        )
    }

    best_selling() {
        return new Promise(
            async (res, rej) => {
                try {
                    let bestProducts = [];
                    bestProducts = await PorductModel.find({ best_seller: true }).populate(["category", "color"]);
                    res({
                        bestProducts,
                        msg: "Product found",
                        ProdImgPath: "/images/product/",
                        status: 1
                    })
                } catch (err) {
                    rej({
                        msg: "Internal server error of best seller",
                        status: 0
                    })
                }
            }
        )
    }
}

module.exports = ProdcutController;
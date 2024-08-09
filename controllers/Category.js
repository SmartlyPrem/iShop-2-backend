const Category = require('../models/Category');
const {unlinkSync} = require('fs');

class CategoryController {
    create(data, image) {
        return new Promise(
            async (res, rej) => {
                try {
                    const createdData = await Category.findOne({ slug: data.slug })
                    if (createdData) {
                        rej({
                            msg: "This category already exist",
                            status: 0
                        })
                    } else {
                        const imageName = new Date().getTime() + Math.floor(Math.random() * 1000) + image.name;
                        const destination = "./public/images/category/" + imageName;
                        image.mv(
                            destination,
                            (err) => {
                                if (err) {
                                    rej({
                                        msg: "Unable to upload image",
                                        status: 0
                                    })
                                } else {
                                    const category = new Category({
                                        name: data.name,
                                        slug: data.slug,
                                        image: imageName
                                    });
                                    category.save()
                                        .then(
                                            () => {
                                                res({
                                                    msg: "Category added",
                                                    status: 1
                                                })
                                            }
                                        )
                                        .catch(
                                            () => {
                                                rej({
                                                    msg: "Unable to add category",
                                                    status: 0
                                                })
                                            }
                                        )
                                }
                            }
                        )
                    }
                } catch (err) {
                    rej({
                        msg: "Internal Server error",
                        status: 0
                    })
                }
            }
        )
    }

    getData(id) {
        return new Promise(
            async (res, rej) => {
                try {
                    let data = "";
                    if (id) {
                        data = await Category.findById({ _id: id })
                    } else {
                        data = await Category.find();
                    }
                    res({
                        data,
                        msg: "Got the data",
                        status: 1,
                        imageBaseUrl: "/images/category/"
                    })

                } catch (err) {
                    rej({
                        msg: "Unable to find data",
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
                    // const deletedData = await Category.findByIdAndDelete(id)
                    const imagePath = await Category.findById(id);
                    fs.unlink('./public/images/category/' + imagePath.image, (error) => console.log(error))
                    await Category.deleteOne({ _id: id })
                        .then(
                            () => {
                                res({
                                    msg: "Category was deleted",
                                    status: 1
                                })
                            }
                        ).catch(
                            () => {
                                rej({
                                    msg: "Unable to delete Category",
                                    status: 0
                                })
                            }
                        )
                } catch (err) {
                    rej({
                        msg: "Internal Server Error",
                        status: 0
                    })
                }
            }
        )
    }

    changeStatus(id, new_status) {
        return new Promise(
            (res, rej) => {
                try {
                    Category.updateOne(
                        { _id: id }, { status: new_status }
                    ).then(
                        (success) => {
                            res({
                                msg: "Status changed",
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
                        msg: "Internal server error",
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
                        Category.updateOne({ _id: id }, { name: data.name, slug: data.slug })
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
                        const destination = "./public/images/category/" + newImage;
                        image.mv(
                            destination,
                            (err) => {
                                if (!err) {
                                    Category.updateOne({ _id: id }, { name: data.name, slug: data.slug, image: newImage })
                                        .then(
                                            (success) => {
                                                unlinkSync(`./public/images/category/${data.oldImage}`)
                                                res({
                                                    msg: "Data Updated",
                                                    status: 1
                                                })
                                            }
                                        ).catch(
                                            (error) => {
                                                rej({
                                                    msg: "Data unable to update",
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
}

module.exports = CategoryController;
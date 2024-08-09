const ColorModel = require('../models/Color');

class ColorController {
    create(data) {
        return new Promise(
            (res, rej) => {
                try {
                    const colorSet = new ColorModel({
                        name: data.name,
                        code: data.color
                    });
                    colorSet.save()
                        .then(
                            (success) => {
                                res({
                                    msg: "Color Added",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                console.log("error ->", error.message);
                                rej({
                                    msg: "Unable to add color",
                                    status: 0
                                })
                            }
                        )
                } catch (error) {
                    rej({
                        msg: "Internal Server error of mine",
                        status: 0
                    })
                }
            }
        )
    }

    read(id) {
        return new Promise(
            async (res, rej) => {
                try {
                    let colors = [];
                    if (id) {
                        colors = await ColorModel.findById(id);
                    } else {
                        colors = await ColorModel.find();
                    }
                    res({
                        colors,
                        msg: "Color found",
                        status: 1
                    })
                } catch (error) {
                    rej({
                        msg: "Internal server error of mine",
                        status: 0
                    })
                }
            }
        )
    }

    edit(id, data) {
        return new Promise(
            (res, rej) => {
                try {
                    ColorModel.updateOne({ _id: id }, { name: data.name, code: data.color })
                        .then(
                            (success) => {
                                res({
                                    msg: "Color updated",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                rej({
                                    msg: "Unable to update color",
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

    delete(id) {
        return new Promise(
            (res, rej) => {
                try {
                    ColorModel.deleteOne({ _id: id })
                        .then(
                            (success) => {
                                res({
                                    msg: "Color deleted",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                rej({
                                    msg: "Unable to delete color",
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
                    ColorModel.updateOne({_id : id}, {status : data.status})
                    .then(
                        (success)=>{
                            res({
                                msg: "Color status changed",
                                status: 1
                            })
                        }
                    ).catch (
                        (error)=>{
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
}

module.exports = ColorController;
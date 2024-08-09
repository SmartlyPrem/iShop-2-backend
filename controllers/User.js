const { encryptPass, descryptPass, getToken } = require("../helper");
const CartModel = require("../models/Cart");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const UserModel = require("../models/User");
const { unlinkSync } = require('fs');

class UserCtr {
    register(data) {
        return new Promise(
            async (res, rej) => {
                try {
                    const axistingEmail = await UserModel.findOne({ email: data.email });
                    if (axistingEmail) {
                        rej({
                            msg: "Already email axist",
                            status: 0
                        })
                    } else {
                        const user = new UserModel({
                            name: data.name,
                            email: data.email,
                            password: encryptPass(data.password)
                        });
                        const token = getToken(user.toObject());
                        user.save()
                            .then(
                                res({
                                    msg: "Account successfully created",
                                    status: 1,
                                    user,
                                    token
                                })
                            ).catch(
                                rej({
                                    msg: "account not created due to any error",
                                    status: 0
                                })
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

    login(data) {
        return new Promise(
            async (res, rej) => {
                try {
                    const user = await UserModel.findOne({ email: data.email });
                    if (user) {
                        if (descryptPass(user.password) == data.password) {
                            const token = getToken(user.toObject());
                            res({
                                msg: "Successfully login",
                                status: 1,
                                user,
                                token
                            })
                        } else {
                            rej({
                                msg: "Invalid password",
                                status: 0
                            })
                        }
                    } else {
                        rej({
                            msg: "Invalid email",
                            status: 0
                        })
                    }
                } catch (err) {
                    rej({
                        msg: "Internal Server error of mine",
                        status: 0
                    })
                }
            }
        )
    }

    getUser(user_id) {
        return new Promise(
            async (res, rej) => {
                let user;
                try {
                    if (user_id) {
                        console.log(user_id);
                        user = await UserModel.findOne({ _id: user_id });
                    }else{
                        user = await UserModel.find();
                    }
                    res({
                        msg: "find user",
                        user,
                        total : user.length,
                        status: 1
                    })
                } catch (err) {
                    rej({
                        msg: 'Internal Server error of mine',
                        status: 0
                    })
                }
            }
        )
    }

    editUser(user_id, data, image) {
        return new Promise(
            async (res, rej) => {
                try {
                    if (image == null) {
                        UserModel.updateOne({ _id: user_id }, {
                            name: data.name,
                            lastName: data.lastName,
                            email: data.email,
                            contact: data.contact,
                            gender: data.gender,
                            bio: data.bio,
                            address: JSON.parse(data.address)
                        })
                            .then(
                                (success) => {
                                    res({
                                        msg: "user data updated",
                                        status: 1
                                    })
                                }
                            ).catch(
                                (error) => {
                                    rej({
                                        msg: "Unable to update",
                                        status: 0
                                    })
                                }
                            )
                    } else {
                        const newImage = new Date().getTime() + Math.floor(Math.random() * 1000) + image.name;
                        const destination = "./public/images/user/" + newImage;
                        image.mv(
                            destination,
                            (err) => {
                                if (!err) {
                                    UserModel.updateOne({ _id: user_id }, {
                                        name: data.name,
                                        lastName: data.lastName,
                                        email: data.email,
                                        contact: data.contact,
                                        bio: data.bio,
                                        gender: data.gender,
                                        address: JSON.parse(data.address),
                                        image: newImage
                                    })
                                        .then(
                                            (success) => {
                                                console.log(data.oldImage)
                                                unlinkSync(`./public/images/user/${data.oldImage}`);
                                                res({
                                                    msg: "Data Updated with image",
                                                    status: 1,
                                                    userImagePath: "/images/category/"
                                                })
                                            }
                                        ).catch(
                                            (error) => {
                                                res({
                                                    msg: "Unable to upload with image",
                                                    status: 0
                                                })
                                            }
                                        )
                                } else {
                                    rej({
                                        msg: "error to upload image",
                                        staus: 0
                                    })
                                }
                            }
                        )
                    }
                } catch (err) {
                    rej({
                        msg: 'Internal Server error of mine',
                        status: 0
                    })
                }
            }
        )
    }

    deleteUser(user_id) {
        return new Promise(
            async (res, rej) => {
                try {
                    await CartModel.deleteMany({user_id : user_id});
                    await Order.deleteMany({user_id : user_id});
                    await Transaction.deleteMany({user_id : user_id});
                    UserModel.deleteOne({ _id: user_id })
                        .then(
                            (success) => {
                                res({
                                    msg: "user deleted",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                rej({
                                    msg: "user not deleted",
                                    status: 0
                                })
                            }
                        )
                } catch (err) {
                    rej({
                        msg: 'Internal Server error of mine',
                        status: 0
                    })
                }
            }
        )
    }

    deactivateUser(user_id) {
        return new Promise(
            async (res, rej) => {
                try {
                    UserModel.updateOne({ _id: user_id }, { status: false })
                        .then(
                            (success) => {
                                res({
                                    msg: "user was deactivated",
                                    status: 1
                                })
                            }
                        ).catch(
                            (error) => {
                                rej({
                                    msg: "user not deactivet",
                                    status: 0
                                })
                            }
                        )
                } catch (err) {
                    rej({
                        msg: 'Internal Server error of mine',
                        status: 0
                    })
                }
            }
        )
    }
}

module.exports = UserCtr;
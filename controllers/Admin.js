const { descryptPass, encryptPass, getToken } = require("../helper");
const Admin = require("../models/Admin");

class AdminCtrl {
    signIn(data) {
        return new Promise(
            async (res, rej) => {
                try {
                    const admin = await Admin.findOne({ email: data.email });
                    if (admin) {
                        if (descryptPass(admin.password) == data.password) {
                            const token = getToken(admin.toObject());
                            res({
                                msg: "Admin is currect",
                                status: 1,
                                admin,
                                save: data.checkbox,
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
                    console.log(err.message)
                    rej({
                        msg: 'Internal Server error of mine',
                        status: 0
                    })
                }
            }
        )
    }

    createAuthor(data) {
        return new Promise(
            async (res, rej) => {
                try {
                    const axistingEmail = await Admin.findOne({ email: data.email });
                    if (axistingEmail) {
                        rej({
                            msg: "Already email axist",
                            status: 0
                        })
                    } else {
                        const author = new Admin({
                            name: data.name,
                            lastName: data.lastName,
                            email: data.email,
                            password: encryptPass(data.password)
                        })
                        author.save()
                            .then(
                                (success) => {
                                    const token = getToken(author.toObject());
                                    res({
                                        msg: "Account successfully created",
                                        status: 1,
                                        author,
                                        token
                                    })
                                }
                            ).catch(
                                (error) => {
                                    console.log(error.message)
                                    rej({
                                        msg: "account not created due to any error",
                                        status: 0
                                    })
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
}

module.exports = AdminCtrl;
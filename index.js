const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const CategoryRouter = require('./routers/Category');
const ColorRouter = require('./routers/Color');
const ProductRouter = require('./routers/Product');
const UserRouter = require('./routers/User');
const CartRouter = require('./routers/Cart');
const OrderRouter = require('./routers/Order');
// const adminAuth = require('./middleware/adminAuth');
const TransitionRouter = require('./routers/Transition');
const AdminRouter = require('./routers/Admin');
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// app.get(
//     "/test",
//     adminAuth,
//     (req, res)=>{
//         res.send("hii")
//     }
// )

app.use("/category", CategoryRouter);
app.use("/color", ColorRouter);
app.use("/product", ProductRouter);
app.use("/user", UserRouter);
app.use("/cart", CartRouter);
app.use("/order", OrderRouter);
app.use("/transaction", TransitionRouter);
app.use("/admin", AdminRouter);

mongoose.connect(
    "mongodb://atlas-sql-66b62064d7191962130e1a78-0t8oc.a.query.mongodb.net/firstProject?ssl=true&authSource=admin",
    {
        dbName: "firstProject"
    }
)
.then(
    (success)   =>{
        console.log("ZYX Server Chalu Hai");
        app.listen(port, ()=> console.log("ZYX Server Connect"))
    }
).catch(
    (err)=>{
        console.log("XYZ mongodb not Connect");
    }
)

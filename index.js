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
    "mongodb://localhost:27017",
    {
        dbName: "firstProject"
    }
)
.then(
    (success)   =>{
        console.log("Server Chalu Hai");
        app.listen(5000, ()=> console.log("Server Started"))
    }
).catch(
    (err)=>{
        console.log("The server not connect to the database");
    }
)
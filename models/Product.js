const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true
        },
        slug : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        discount_per : {
            type : Number,
            default : 0
        },
        discount_price : {
            type : Number
        },
        image : {
            type : String,
        },
        category : {
            type : mongoose.Schema.ObjectId,
            ref : "Category"
        },
        color : [
            {
                type : mongoose.Schema.ObjectId,
                ref : "Color"
            }
        ],
        stocks : {
            type : String,
            default : "N/A",
        },
        best_seller : {
            type : Boolean,
            default : true
        },
        status : {
            type : Boolean,
            default : true
        }
    },
    {
        timestamps : true
    }
)

const PorductModel = mongoose.model("Product", ProductSchema);

module.exports = PorductModel;
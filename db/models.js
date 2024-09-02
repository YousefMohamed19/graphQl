import mongoose, { Schema,model } from "mongoose";

const productSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    category: { type: Schema.Types.ObjectId, ref: "Category" }
})
export const Product = model("Product", productSchema)

const categorySchema = new Schema({
    name: String
})
export const Category = model("Category", categorySchema)


export const connectDB = () => mongoose.connect("mongodb://localhost:27017/e-commerce").then(() => console.log("connect to db"))

require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected to CourseCommerce DB");
});

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
});

const adminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    creatorId: mongoose.Schema.Types.ObjectId
});

const purchaseSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    courseId: mongoose.Schema.Types.ObjectId
});

const userModel = mongoose.model("users", userSchema);
const adminModel = mongoose.model("admins", adminSchema);
const courseModel = mongoose.model("courses", courseSchema);
const purchaseModel = mongoose.model("purchases", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
};
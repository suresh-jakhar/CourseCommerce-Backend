const mongoose = require("mongoose");

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
    price: { type: Number, default: 0 },
    imageUrl : String,
    isFree: { type: Boolean, default: false },
    creatorId: mongoose.Schema.Types.ObjectId
});

const enrollmentSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    courseId: mongoose.Schema.Types.ObjectId
});

const userModel = mongoose.model("users", userSchema);
const adminModel = mongoose.model("admins", adminSchema);
const courseModel = mongoose.model("courses", courseSchema);
const enrollmentModel = mongoose.model("enrollments", enrollmentSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    enrollmentModel
};
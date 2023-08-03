const Mongoose = require("mongoose");
// const logger = require("../scripts/logger/Users");

const UserSchema = new Mongoose.Schema({
    full_name: String,
    password: String,
    email: String,
    profile_image: String,
    
},{timestamps: true, versionKey: false});

// ProjectSchema.pre("save", (next, doc) => {
//     console.log("Öncesi", doc);
//     next();
// })

// UserSchema.post("save", (doc) => {
//     logger.log({
//         level: "info",
//         message: doc,
//     })
// })

module.exports = Mongoose.model("user", UserSchema);
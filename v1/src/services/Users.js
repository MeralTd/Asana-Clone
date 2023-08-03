const User =  require("../models/Users")

const insert = (data) => {
    const users = new  User(data)
    return users.save();
}

const loginUser = (loginData) => {
    return User.findOne(loginData);
}

const list = () => {
    return User.find({})
}

const modify = (where, data) => {
    return User.findOneAndUpdate(where, data, {new: true});
}

const remove = (id) => {
    return User.findByIdAndDelete(id);
}


module.exports ={
    insert,
    list,
    loginUser,
    modify,
    remove
}
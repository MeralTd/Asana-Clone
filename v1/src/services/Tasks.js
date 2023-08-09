const Task =  require("../models/Tasks")

const findOne = (where, extend) => {
    if(!extend) return Task.findOne(where);
    return Task.find(where || {})
    .populate({
        path:"user_id",
        select: "full_name email profile_image",
    })
    .populate({
        path:"comments",
        populate: {
            path: "user_id",
            select: "full_name email profile_image",
        }
    })
    .populate({
        path:"sub_tasks",
        select: "title description isCompleted assingned_to due_date order sub_tasks statuses",
        
    });
}


const insert = (taskData) => {
    return new Task(taskData).save();
}

const list = (where) => {
    return Task.find(where || {}).populate({
        path:"user_id",
        select: "full_name email profile_image",
    });
}

const modify = (data, id) => {
    return Task.findByIdAndUpdate(id, data, {new: true});
}

const remove = (id) => {
    return Task.findByIdAndDelete(id);
}

module.exports ={
    insert,
    list,
    modify,
    remove,
    findOne
}
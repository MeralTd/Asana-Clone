const BaseModel = require("../models/Tasks");
const BaseService = require("./BaseService");

class TaskService extends BaseService {
  constructor() {
    super(BaseModel);
  }

  list(where) {
    return BaseModel.find(where || {}).populate({
      path: "user_id",
      select: "full_name email profile_image",
    });
  }

  findOne(where, extand) {
    if (!extand) return BaseModel.findOne(where);
    return BaseModel.findOne(where).populate(
     [ 
      {
        path: "user_id",
        select: "full_name email profile_image",
      },
      {
        path: "comments",
        populate: {
          path: "user_id",
          select: "full_name email profile_image",
        },
      },
      {
        path: "sub_tasks",
        select: "title description isCompleted assingned_to due_date order sub_tasks statuses",
      }
    ]);
  }
}

module.exports = new TaskService();

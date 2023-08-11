const BaseModel =  require("../models/Users")
const BaseService = require("./BaseService");

class UserService extends BaseService {
    constructor(){
        super(BaseModel)
    }
}

module.exports = new UserService();
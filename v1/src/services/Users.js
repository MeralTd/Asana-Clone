const BaseModel =  require("../models/Users")
const BaseService = require("./BaseService");

class Users extends BaseService {
    constructor(){
        super(BaseModel)
    }
}

module.exports = Users;
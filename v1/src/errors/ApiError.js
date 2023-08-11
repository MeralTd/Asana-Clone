class ApiError extends Error {

    constructor(message, statusCode){
        super(message);
        this.message = message;
        this.status = statusCode;
    }

    static notFound(){
        this.message = "Böyle bir kayıt bulunmmamaktadır";
        this.status = 404;
    }
}

module.exports = ApiError;
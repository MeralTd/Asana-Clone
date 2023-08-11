// const { insert, list, loginUser, modify, remove } = require("../services/Users");

const { passwordToHash, generateAccessToken, generateRefreshToken } = require("../scripts/utils/helper");
const httpStatus = require("http-status");
const uuid = require("uuid");
const path = require("path");
const eventEmitter = require("../scripts/events/eventEmitter");

const ProjectService = require("../services/ProjectService");
const UserService = require("../services/UserService");

class User {
  create(req, res){
    req.body.password = passwordToHash(req.body.password);
  
    UserService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };
  
  login(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.findOne(req.body)
      .then((user) => {
        console.log(user);
        if (!user) return res.status(httpStatus.NOT_FOUND).send({ message: "Böyle bir kullanıcı bulunmamaktadır." });
  
        user = {
          ...user.toObject(),
          tokens: {
            access_token: generateAccessToken(user),
            refresh_token: generateRefreshToken(user),
          },
        };
        delete user.password;
        res.status(httpStatus.OK).send(user);
      })
      .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
  };
  
  index (req, res) {
    UserService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };
  
  projectList (req, res) {
    ProjectService.list({ user_id: req.user?._id })
      .then((projects) => {
        res.status(httpStatus.OK).send(projects);
      })
      .catch(() =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Projeleri getirirken beklenmedik bir hata oluştu.",
        })
      );
  };
  
  resetPassword(req, res) {
    const new_password = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`;
  
    UserService.updateWhere({ email: req.body.email }, { password: passwordToHash(new_password) })
      .then((updatedUser) => {
        if (!updatedUser) return res.status(httpStatus.NOT_FOUND).send({ error: "Böyle bir kullanıcı bulunmamaktadır" });
  
        eventEmitter.emit("send_email", {
          to: updatedUser.email, // list of receivers
          subject: "Şifre Sıfırlama", // Subject line
          html: `Yeni Şifreniz: <b>${new_password}</b>`, // html body
        });
  
        res.status(httpStatus.OK).send({
          message: "Yeni şifreniz eposta adresinize gönderildi.",
        });
      })
      .catch(() => res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: "Şifre resetleme sırasında hata oluştu." }));
  };
  
  update(req, res) {
    UserService.update(req.user?._id, req.body)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch(() =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Güncelleme işlemi sırasında bir problem oluştu.",
        })
      );
  };
  
  changePassword(req, res) {
    req.body.password = passwordToHash(req.body.password);
    UserService.update(req.user?._id, req.body)
      .then((updatedUser) => {
        res.status(httpStatus.OK).send(updatedUser);
      })
      .catch(() =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Güncelleme işlemi sırasında bir problem oluştu.",
        })
      );
  };
  
  deleteUser(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "ID Bilgisi eksik",
      });
    }
  
    UserService.delete(req.params?.id)
      .then((deletedUser) => {
        if (!deletedUser) {
          return res.status(httpStatus.NOT_FOUND).send({ error: "Böyle bir kullanıcı bulunmamaktadır." });
        }
        res.status(httpStatus.OK).send({ message: "Kullanıcı silinmiştir." });
      })
      .catch((e) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Silme işlemi sırasında bir problem oldu",
        })
      );
  };
  
  updateProfileImage(req, res) {
    if (!req?.files?.profile_image) {
      return res.status(httpStatus.BAD_REQUEST).send({ error: "Bir hata oluştu." });
    }
  
    const extension = path.extname(req.files.profile_image.name);
    const fileName = `${req.user._id}${extension}`;
    const folderPath = path.join(__dirname, "../", "uploads/users", fileName);
  
    req.files.profile_image.mv(folderPath, function (err) {
      if (err) return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: err });
  
      UserService.update(req.user._id, { profile_image: fileName })
        .then((updatedUser) => {
          res.status(httpStatus.OK).send(updatedUser);
        })
        .catch(() =>
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: "Güncelleme işlemi sırasında bir problem oluştu.",
          })
        );
    });
  };
}

module.exports = new User();
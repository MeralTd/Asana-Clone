// const { insert, list, modify, remove } = require("../services/Projects");
const httpStatus = require("http-status");
const ProjectService = require("../services/ProjectService");

class Project {

  index(req, res) {
    ProjectService.list()
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };

  create(req, res) {
    req.body.user_id = req.user;
    ProjectService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };

  update(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "ID Bilgisi eksik",
      });
    }
    ProjectService.update(req.params?.id, req.body)
      .then((updatedProject) => {
        res.status(httpStatus.OK).send(updatedProject);
      })
      .catch((e) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Kayıt sırasında bir problem oldu",
        })
      );
  };
  
  deleteProject(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "ID Bilgisi eksik",
      });
    }
  
    ProjectService.delete(req.params?.id)
      .then((deletedProject) => {
        if(!deletedProject){
          return res.status(httpStatus.NOT_FOUND).send({error: "Böyle bir kayıt bulunmamaktadır."});
  
        }
        res.status(httpStatus.OK).send({message: "Proje silinmiştir."});
      })
      .catch((e) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Silme işlemi sırasında bir problem oldu",
        })
      );
  };
}

module.exports = new Project();

// const { insert, list, modify, remove } = require("../services/Sections");
const httpStatus = require("http-status");
const SectionService = require("../services/SectionService");

class Section {
  
  index(req, res) {

    if (!req.params?.projectId) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Proje Bilgisi eksik",
      });
    }
  
    SectionService.list({ project_id: req.params.projectId})
      .then((response) => {
        res.status(httpStatus.OK).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };
  
  create(req, res){
    req.body.user_id = req.user;
    SectionService.create(req.body)
      .then((response) => {
        res.status(httpStatus.CREATED).send(response);
      })
      .catch((e) => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
      });
  };
  
  update(req, res){
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "ID Bilgisi eksik",
      });
    }
    SectionService.update(req.params?.id, req.body)
      .then((updatedSection) => {
        res.status(httpStatus.OK).send(updatedSection);
      })
      .catch((e) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Kayıt sırasında bir problem oldu",
        })
      );
  };
  
  deleteSection(req, res) {
    if (!req.params?.id) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "ID Bilgisi eksik",
      });
    }
  
    SectionService.delete(req.params?.id)
      .then((deletedSection) => {
        if(!deletedSection){
          return res.status(httpStatus.NOT_FOUND).send({error: "Böyle bir kayıt bulunmamaktadır."});
  
        }
        res.status(httpStatus.OK).send({message: "Section silinmiştir."});
      })
      .catch((e) =>
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
          error: "Silme işlemi sırasında bir problem oldu",
        })
      );
  };
}

module.exports = new Section();


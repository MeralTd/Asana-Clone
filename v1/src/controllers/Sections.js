const { insert, list, modify, remove } = require("../services/Sections");
const httpStatus = require("http-status");

const index = (req, res) => {

  if (!req.params?.projectId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Proje Bilgisi eksik",
    });
  }

  list({ project_id: req.params.projectId})
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const create = (req, res) => {
  req.body.user_id = req.user;
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const update = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "ID Bilgisi eksik",
    });
  }
  modify(req.body, req.params?.id)
    .then((updatedSection) => {
      res.status(httpStatus.OK).send(updatedSection);
    })
    .catch((e) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Kayıt sırasında bir problem oldu",
      })
    );
};

const deleteSection = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "ID Bilgisi eksik",
    });
  }

  remove(req.params?.id)
    .then((deletedSection) => {
      if(!deletedSection){
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

module.exports = {
  create,
  index,
  update,
  deleteSection
};

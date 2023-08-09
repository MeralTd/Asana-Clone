const { insert, list, modify, remove, findOne } = require("../services/Tasks");
const httpStatus = require("http-status");

const index = (req, res) => {
  if (!req.params?.projectId) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Proje Bilgisi eksik",
    });
  }

  list({ project_id: req.params.projectId })
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
    .then((updatedTask) => {
      res.status(httpStatus.OK).send(updatedTask);
    })
    .catch((e) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Kayıt sırasında bir problem oldu",
      })
    );
};

const deleteTask = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "ID Bilgisi eksik",
    });
  }

  remove(req.params?.id)
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(httpStatus.NOT_FOUND).send({ error: "Böyle bir kayıt bulunmamaktadır." });
      }
      res.status(httpStatus.OK).send({ message: "Task silinmiştir." });
    })
    .catch((e) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Silme işlemi sırasında bir problem oldu",
      })
    );
};

const makeComment = (req, res) => {
  findOne({ _id: req.params.id })
    .then((mainTask) => {
      if (!mainTask)
        return res.status(httpStatus.NOT_FOUND).send({
          error: "Böyle bir kayıt bulunmamaktadır.",
        });

      const comment = {
        ...req.body,
        commented_at: new Date(),
        user_id: req.user,
      };

      mainTask.comments.push(comment);
      mainTask
        .save()
        .then((updateTask) => {
          return res.status(httpStatus.OK).send(updateTask);
        })
        .catch((e) =>
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: "Kayıt sırasında bir problem oldu",
          })
        );
    })
    .catch((e) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Kayıt sırasında bir problem oldu",
      })
    );
};

const deleteComment = (req, res) => {
  console.log(req.params.id);
  findOne({ _id: req.params.id })
    .then((mainTask) => {
      if (!mainTask)
        return res.status(httpStatus.NOT_FOUND).send({
          error: "Böyle bir kayıt bulunmamaktadır.",
        });

      // mainTask.comments = mainTask.comments.filter((c) => c._id != req.params.commentId);
      mainTask.comments = mainTask.comments.filter((c) => c._id?.toString() != req.params.commentId);

      mainTask
        .save()
        .then((updateTask) => {
          return res.status(httpStatus.OK).send(updateTask);
        })
        .catch((e) =>
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            error: "Kayıt sırasında bir problem oldu",
          })
        );
    })
    .catch((e) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Kayıt sırasında bir problem oldu",
      })
    );
};

const addSubTask = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "ID Bilgisi eksik",
    });
  }

  findOne({ _id: req.params.id })
    .then((mainTask) => {
      if (!mainTask)
        return res.status(httpStatus.NOT_FOUND).send({
          error: "Böyle bir kayıt bulunmamaktadır.",
        });

      insert({ ...req.body, user_id: req.user })
        .then((subTask) => {
          mainTask.sub_tasks.push(subTask);

          mainTask
            .save()
            .then((updateTask) => {
              return res.status(httpStatus.OK).send(updateTask);
            })
            .catch((e) =>
              res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                error: "Kayıt sırasında bir problem oldu",
              })
            );
        })
        .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
    })
    .catch((e) =>
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "Kayıt sırasında bir problem oldu",
      })
    );
};


const fetchTask = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "ID Bilgisi eksik",
    });
  }


  findOne({ _id: req.params.id }, true )
  .then((task) => {
    if (!task)
      return res.status(httpStatus.NOT_FOUND).send({
        error: "Böyle bir kayıt bulunmamaktadır.",
      });

    res.status(httpStatus.OK).send(task);
  })
  .catch((e) =>
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      error: "Kayıt sırasında bir problem oldu",
    })
  );


};


module.exports = {
  create,
  index,
  update,
  deleteTask,
  makeComment,
  deleteComment,
  addSubTask,
  fetchTask
};

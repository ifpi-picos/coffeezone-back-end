module.exports = class AuthorizationRoute {
  constructor(app) {
    const { Router } = require("express");
    const routes = Router();

    routes.get("/", async (req, res) => {
      try {
        if (req.user.type == "Coordinator") {
          const authorizations = await app.db.authorization.getAll();

          if (authorizations) {
            res.status(200).json(authorizations);
          }
          else {
            res.status(404).json({ error: "Nenhuma item para ser autorizado" });
          }
        }
        else {
          const authorizations = await app.db.authorization.getByUserId(req.user.id);

          if (authorizations) {
            res.status(200).json(authorizations);
          }
          else {
            res.status(404).json({ error: "Nenhuma item para ser autorizado" });
          }
        }
      }
      catch (err) {
        app.log.error(err);
        res.status(500).json({ error: "Error ao tentar retornar a lista de autorizações" });
      }
    });

    routes.put("/", async (req, res) => {
      try {
        if (req.user.type == "Coordinator") {
          const authorization = await app.db.authorization.getById(req.body.id);

          if (authorization) {
            if (authorization.status == "Pending") {
              if (req.body.status == "Approved") {
                await app.db.authorization.approve(authorization.dataValues);
                res.status(200).json({ success: "Autorização aprovada com sucesso" });
              }
              else if (req.body.status == "Denied") {
                await app.db.authorization.deny(authorization.dataValues);
                res.status(200).json({ success: "Autorização negada com sucesso" });
              }
              else {
                res.status(400).json({ error: "Status inválido" });
              }
            }
            else {
              res.status(400).json({ error: "Autorização já foi aprovada ou negada" });
            }
          }
          else {
            res.status(404).json({ error: "Autorização não encontrada" });
          }
        }
        else {
          res.status(403).json({ error: "Somente coordenadores podem autorizar ou negar items" });
        }
      }
      catch (err) {
        app.log.error(err);
        res.status(500).json({ error: "Error ao tentar autorizar ou negar o item" });
      }
    })

    return { path: "/authorization/", router: routes };
  }
};

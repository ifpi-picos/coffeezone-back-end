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

    return { path: "/authorization/", router: routes };
  }
};

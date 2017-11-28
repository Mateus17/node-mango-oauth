// Configuration du module
let mongodb = require("mongodb");
let ObjectId = mongodb.ObjectId;
let MongoClient = mongodb.MongoClient;
let mongodbUrl = "mongodb://127.0.0.1:27017/tasks";

let express = require("express");
let router = express.Router();

// Configuration de la route principale => http://localhost:8080/api
router.get("/", (req, res, next) => {
  res.json({ res: "Bienvenue dans notre API" });
});

router.get("/tasks", (req, res, next) => {
  // Ouvrir une connexion sur la base MongoDb
  MongoClient.connect(mongodbUrl, (err, db) => {
    // Tester la connexion
    if (err) {
      res.send(err);
    } else {
      // Récupération des documents de la collection 'list' => find
      db
        .collection("list")
        .find()
        .toArray((err, tasks) => {
          // Tester la commande MongoDb
          if (err) {
            res.send(err);
          } else {
            // Envoyer les données au format json
            res.json(tasks);
          }
        });
    }
    db.close();
  });
});

router.post("/task", (req, res, next) => {
  // Récupération des données depuis la requête
  let task = req.body;

  // Vérifier la présence de valeur dans la requête
  if (!task.title) {
    res.status(400);
    res.json({ error: "Bad data" });
  } else {
    // Définition de la propriété isDone
    task.isDone = false;

    MongoClient.connect(mongodbUrl, (err, db) => {
      // Tester la connexion
      if (err) {
        res.send(err);
        db.close();
      } else {
        // Ajouter un document  dans la collection 'list' => insert
        db.collection("list").insert([task], (err, data) => {
          // Vérification de la commande MongoDb
          if (err) {
            res.send(err);
          } else {
            res.status(201);
            res.send(task);
            // Fermer la connexion à la base MongoDb
            db.close();
          }
        });
      }
    });
  }
});

router.put("/task/:id", (req, res, next) => {
  // Récupération des données depuis la requête
  let task = req.body;

  // Définition d'un objet pour analyser les données de la requête
  let updTask = {};

  // Assignation des valeurs de la requête dans l'objet
  // if (task.isDone !== null && task.isDone !== undefined) {
  updTask.title = task.title;
  updTask.isDone = task.isDone;
  // }
  // if (task.title) {
  //   updTask.title = task.title;
  // }

  // Vérifier la présence de valeur dans la requête
  if (!updTask) {
    res.status(400);
    res.json({ error: "Bad data" });
  } else {
    // Ouvrir une connexion sur la base MongoDb => connect
    MongoClient.connect(mongodbUrl, (err, db) => {
      // Tester la connexion
      if (err) {
        res.send(err);
        db.close();
      } else {
        // Mettre à jour un document  dans la collection 'list' => update
        db
          .collection("list")
          .update(
            { _id: new ObjectId(req.params.id) },
            updTask,
            {},
            (err, data) => {
              // Vérification de la commande MongoDb
              if (err) {
                res.send(err);
              } else {
                res.send(data);
                // Fermer la connexion à la base MongoDb
                db.close();
              }
            }
          );
      }
    });
  }
});

router.delete("/task/:id", (req, res, next) => {
  // Ouvrir une connexion sur la base MongoDb => connect
  MongoClient.connect(mongodbUrl, (err, db) => {
    // Tester la connexion
    if (err) {
      res.send(err);
      db.close();
    } else {
      // Supprimer un document  dans la collection 'list' => remove
      db
        .collection("list")
        .remove({ _id: new ObjectId(req.params.id) }, (err, data) => {
          // Vérification de la commande MongoDb
          if (err) {
            res.send(err);
          } else {
            res.send(data);
            // Fermer la connexion à la base MongoDb
            db.close();
          }
        });
    }
  });
});

// Export du module
module.exports = router;

### Instalation

* Premier terminal
  * `npm install` || `yarn install`
  * `npm start` || `yarn start`
* Second terminal
  * `mongod --dbpath ./data` || `mongod`
* Troisième terminal
  * `mongo`
  * Si aucune collections :
    * `use tasks`
    * `db.list.insert([{title:"Installer MongoDB", isDone: false}, {title:
      "Configurer MongoDB", isDone: false}, {title:"Utiliser le shell MongoDB",
      isDone: false})]`
* Quatrième terminal
  * `npm run babel-watch` || `yarn babel-watch`

### TODO

* Sécuriser l'API (passport & bcrypt)
  * Suivre le tuto sur
    [scotch.io](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)

### Done

* Mise en place du serveur NodeJS
* Ajout de Mongo
* Routes API et Front
* Bootstrap via CDN

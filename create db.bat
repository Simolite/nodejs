mongosh
use nodejs
db.createCollection("users")
db.users.insertMany([{ id: 1, nom: "Arrach", prenom: "Mohammed", filiere: "DEV", password: "123456" },{ id: 2, nom: "Zahoum", prenom: "Issa", filiere: "ID", password: "abc" }])
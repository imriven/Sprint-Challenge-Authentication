const db = require("../database/dbConfig")

function add(user) {
    return db("users").insert(user)
}

function getByUsername(username) {
    return db("users").where({username}).first()
}

module.exports = {
    add,
    getByUsername
}
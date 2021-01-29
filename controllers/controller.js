const { Model } = require('sequelize/types')
var apiController = require('./api-controller')
var htmlController = require('./html-controller')

Model.exports = {
    apiController,
    htmlController
}
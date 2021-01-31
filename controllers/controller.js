const { Model } = require('sequelize/types')
const eventController = require('./eventController')
const htmlController = require('./html-controller')
const userController = require('./userController')
const userDialogueController = require('./userDialogueController')

Model.exports = {
    eventController,
    htmlController,
    userController,
    userDialogueController
}
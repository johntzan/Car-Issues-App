'use strict';

module.exports = function(app) {

  var car = require('../controllers/car.controller');

  //Get All Cars in DB & Add New Cars to DB
  app.route('/cars')
    .get(car.list)
    .post(car.create);

  //Get All Car Data by ID
  app.route('/cars/:carID')
    .get(car.read)
    .put(car.updateIssues)
    .delete(car.delete);

  //Get Specific Issue by Issues ID 
  app.route('/cars/:carID/issue/:issueID')
    .get(car.readIssueByID);

  app.route('/cars/:carID/issue/:issueID/upvote')
    .put(car.upvote);

  app.route('/cars/:carID/issue/:issueID/downvote')
    .put(car.downvote);

  //Get All Car Data by ID
  app.route('/cars/name/:carName')
    .get(car.readByName);

};
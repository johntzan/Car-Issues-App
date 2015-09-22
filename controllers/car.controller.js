'use strict';

var mongoose = require('mongoose'),
  Car = mongoose.model('Car');

/**
 * Create a Car
 */
exports.create = function(req, res) {
  var car = new Car(req.body);
  console.log(req.body);

  //need  a check for if req.body/car === '{ }'

  car.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.status(201).json(car);
    }
  });

};

/**
 * Show the current Car by Object ID
 */
exports.read = function(req, res) {
  Car.findById(req.params.carID).exec(function(err, car) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!car) {
        return res.status(404).send({
          message: 'Car not found'
        });
      }
      res.json(car);
    }
  });
};
/**
 * Show the current Car by Name Search
 */
exports.readByName = function(req, res) {
  Car.findOne({
    name: req.params.carName
  }).exec(function(err, car) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!car) {
        return res.status(404).send({
          message: 'Car not found'
        });
      }
      res.json(car);
    }
  });
};
/**
 * Show the Specific Issue by CarID and IssueID
 */
exports.readIssueByID = function(req, res) {
  Car.findById(req.params.carID).exec(function(err, car) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!car) {
        return res.status(404).send({
          message: 'Issue not found'
        });
      }

      res.json(car.issues.id(req.params.issueID));
      console.log('Car ID: ' + req.params.carID);
      console.log('Issue ID: ' + req.params.issueID);

      console.log('Issue Ups: ' + car.issues.id(req.params.issueID).up); //gets issue up count. by issue ID.
      console.log('Issue Downs: ' + car.issues.id(req.params.issueID).down);

      // console.log('Issues_issueID: ' + car.issues.id(req.params.issueID)); check if issueID is correct


    }
  });
};
/* 
 * Delete a car from DB by Object Id
 */
exports.delete = function(req, res) {
  Car.findById(req.params.carID).exec(function(err, car) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!car) {
        return res.status(404).send({
          message: 'Car not found'
        });
      }

      car.remove(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          console.log('Deleted: ' + car.name);
        }
      });

    }
  });

}
/* 
 **update issues array with new one issue for a specific car by id
 */
exports.updateIssues = function(req, res) {
  Car.findByIdAndUpdate(req.params.carID, {
      $push: {
        "issues": {
          mileage: req.body.issues[0].mileage,
          issueName: req.body.issues[0].issueName

        }
      }
    }, {
      safe: true,
      upsert: true,
      new: true
    },
    function(err, car) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {

        if (!car) {
          return res.status(404).send({
            message: 'Car not found'
          });
        }

        console.log('New Issue Added: ' + req.body.issues[0].issueName);
        return res.status(200).json(car);

      }
    });
}
/**
Update issue count up, +1
*/
exports.upvote = function(req, res) {
  //Possibly better implementation with $push or $inc instead of just save after +1
  Car.findById(req.params.carID).exec(function(err, car) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!car) {
        return res.status(404).send({
          message: 'Car not found'
        });
      }

      console.log(car.issues.id(req.params.issueID));
      // console.log(car.issues.id(req.params.issueID).up);

      car.issues.id(req.params.issueID).up += 1;

      car.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.status(200).json(car.issues.id(req.params.issueID));
          console.log('upvoted');
        }
      });

    }
  });
};

/**
Update issue count down, -1
*/
exports.downvote = function(req, res) {

  Car.findById(req.params.carID).exec(function(err, car) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!car) {
        return res.status(404).send({
          message: 'Car not found'
        });
      }

      console.log(car.issues.id(req.params.issueID));
      // console.log(car.issues.id(req.params.issueID).up);

      car.issues.id(req.params.issueID).down -= 1;

      car.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.status(200).json(car.issues.id(req.params.issueID));
          console.log('downvoted');
        }
      });

    }
  });
};

/**
 * List of Cars in DB
 */
exports.list = function(req, res) {
  Car.find().exec(function(err, cars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cars);
    }
  });
};
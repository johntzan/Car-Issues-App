'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * create Car Schema
 */
var CarSchema = new Schema({
  // the property name
  name: {
    // types are defined e.g. String, Date, Number (http://mongoosejs.com/docs/guide.html)
    type: String,
    required: true
    // default values can be set
    //default: Date.now
  },
  issues: [{

    issueName: {
      type: String,
      required: true

    },
    mileage: {
      type: Number,
      required: true
    },
    up: {
      type: Number,
      default: 0
    },
    down: {
      type: Number,
      default: 0
    }

  }]

});

// Expose the model to other objects (similar to a 'public' setter).
mongoose.model('Car', CarSchema);

// module.exports = Car;
var MongoClient = require('mongodb').MongoClient;
var cfg = require('../config');

var Persistance = Function;
Persistance.db = null;

Persistance = function() {
  var that = this;
  MongoClient.connect(cfg.mongo.connection_string, function(err, db) {
    if(err) throw err;
      that.db = db;
      console.log("Mongo connected thorugh: [%s].", cfg.mongo.connection_string);
    });
  };

  Persistance.prototype.addEntry = function(releaseNotes, release_id, callback) {
    var collection = this.db.collection(cfg.mongo.collection_name);
    releaseNotes["release_id"] = release_id;
    collection.insert(releaseNotes, function(err, docs) {
      if(err) throw err;
      callback(true);
    });
  };

  //Page starts from 0, limit is the number of elements to display;
  Persistance.prototype.list = function(page, limit, callback) {
    var collection = this.db.collection(cfg.mongo.collection_name);
    var skip = (page * limit);
    var cursor = collection.find({}).sort({_id: -1}).limit(limit).skip(skip);
    cursor.toArray(function(error, results) {
      if( error ) {
        callback(error);
      }
    else {
      callback(results);
    }
  });

};



module.exports = exports = Persistance;

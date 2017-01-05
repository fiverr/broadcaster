var cfg = require('../config');
var Mailer = require('../lib/send_it');
var ReleaseNotes = require('../lib/release_notes');
var Persistance = require('../lib/persistance');
var PersistanceProvider = new Persistance();

var title = 'Broadcaster - Generate your release notes';

exports.index = function(req, res){
  res.render('index', { title: title});
};

exports.list = function(req, res){
  //Recent 80 updates, needs configuration and paging, later.
  PersistanceProvider.list(0, 80, function(results){
        results.forEach(function(item){
          item.content = ReleaseNotes.htmlForUpdates(item.updates);
        });
        res.render('list', { title: title, collection: results });
  });
};

exports.list_all = function(req, res){
  //Of course 5000 is not all, but still, it's allot !
  PersistanceProvider.list(0, 5000, function(results){
        results.forEach(function(item){
          item.content = ReleaseNotes.htmlForUpdates(item.updates);
        });
        res.render('list', { title: title, collection: results });
  });
};


exports.next_item = function(req, res){
  var incr = req.query.incr;
  var locals = {
    "major_feature": "major_feature." + incr,
    "minor_feature": "minor_feature." + incr,
    "feature_type": "feature_type." + incr,
    "type_fix": "type_fix." + incr,
    "type_new": "type_new." + incr,
    "fix_or_new": "fix_or_new." + incr,
    "update_title": "update_title." + incr,
    "update_description" : "update_description." + incr,
    "developer" : "developer." + incr,
    "owner" : "owner." + incr
  };
  res.render('item', locals);
};

exports.create = function(req, res){
  var releaseNotes = ReleaseNotes.releaseNotesModel(req.body);
  var complete_status = "Release notes added to project and sent.";

  var html = ReleaseNotes.generateHTML(releaseNotes);
  var plainText  = ReleaseNotes.generatePlainText(releaseNotes);
  var counter = ReleaseNotes.dailyCounter();
  var release_id = counter["date"] + "-" + counter["counter"];
  var subject = "Production Deploy Release Notes - " + release_id;
  Mailer.sendIt(subject, html, plainText);

  PersistanceProvider.addEntry(releaseNotes, release_id, function(){
    res.render('index', { title: title , results: complete_status});
  });

};

exports.ping = function(req, res) {
  res.send('pong from broadcaster');
};

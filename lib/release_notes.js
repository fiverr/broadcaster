//Generate the name-value model for the notes setup.
var cfg = require('../config');
var ReleaseNotes = Function ;

ReleaseNotes.prototype.releaseNotesModel = function releaseNotesModel(data){

  //metadata for release notes
  var releaseNotes = {
    deployed_by: data.deployed_by,
    date: data.date,
    time: data.time,
    updates: []
  };

  //No validation in here, just assume data sent in is perfect;
  var updatesArr = [];
  Object.keys(data).forEach(function(name, idx){

    var reg = isSequenceField(name);
    if (reg){
      var field_name = reg[1]; //parsed out field name;
      var pos = parseInt(reg[3], 10); //The incr index sent for this row
      if (!updatesArr[pos]) {
        updatesArr[pos] = {}; //initilaize if needed
      }
      updatesArr[pos][field_name] = data[name];
    }
  });

  releaseNotes.updates = updatesArr;

  console.log("Model Created for ReleaseNotes: \n " + JSON.stringify(releaseNotes));

  return releaseNotes;
};

function isSequenceField(name){
  return name.match(/^(.*)*(\.)+(\d)+?/);
}


var GLOBAL_COUNTER = {date: "", counter: 1};
ReleaseNotes.prototype.dailyCounter = function dailyCounter(){
  var date = new Date();
  var year = date.getFullYear().toString();
  var month_tmp = (date.getMonth() + 1);
  var month = (month_tmp < 10) ? "0" + month_tmp : month_tmp;
  var day_tmp = date.getDate().toString();
  var day = (day_tmp < 10) ? "0" + day_tmp : day_tmp;
  var now = year + month + day;
  if (GLOBAL_COUNTER["date"] !== now){
    GLOBAL_COUNTER["date"] = now;
    GLOBAL_COUNTER["counter"] = 1;
  }

  return {date: GLOBAL_COUNTER["date"], counter: GLOBAL_COUNTER["counter"]++};
};


//TODO - This needs to be a jade template
ReleaseNotes.prototype.generateHTML = function generateHTML(releaseNotes){
  var str = "<p>Hi All,</p>"
        + "<p>The upcoming deploy will include:</p>"
        + "<br/>";
  var that = this;

      releaseNotes.updates.forEach(function(item){
        str+= that.generateSingleUpdate(item);
      });

      str += "<br/><br/>"
        + "<p>Enjoy!<br/><br/></p>"
        + "<p><b>see release notes history at:</b><br/>"
        + "<a href='"+cfg.global.url_showall+"'>"+cfg.global.url_showall+"</a>";
  return str;
};

ReleaseNotes.prototype.generatePlainText = function generatePlainText(releaseNotes){
  return "plain text is now disabled.";
};

//TODO - This needs to be a jade template, also no need to change data from client, just use the sent data
ReleaseNotes.prototype.generateSingleUpdate = function generateSingleUpdate(update){
    var update = "<p><b><span style='color:OliveDrab'>" + update.feature_type + " Update</span></b><br/>"
      + "<b><span style='color:orange'>" + update.fix_or_new + "</span> " + update.update_title + "</b><br/>"
      + update.update_description + "<br/>"
      + "[Owner: " + update.owner + ", Developed by: " + update.developer + "]</p>";
      return update;
}

module.exports = exports = ReleaseNotes;

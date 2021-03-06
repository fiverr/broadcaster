//Generate the name-value model for the notes setup.
var fs = require("fs");
var path = require("path");
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
  return this.getAndSetCounter(now);

};

ReleaseNotes.prototype.getAndSetCounter = function getAndSetCounter(date){
  //expect strcuture of file to be: DATE###COUNTER, for example 20130201###3

  var DELIMITER = "###";
  var counter = 1;
  var FILE_NAME = "release_counter.db";
  var data = "";
  try {
    data = fs.readFileSync(path.resolve(__dirname, FILE_NAME)).toString();
    var parsed_data = data.split(DELIMITER);
    if (parsed_data[0] == date){
        var cnt = parseInt(parsed_data[1], 10);
        counter = cnt + 1;
    }
  } catch (e){
    //Error occured , file does not exist
    console.log(e);
  }
  
  var new_content = [date, DELIMITER, counter].join("");
  fs.writeFileSync(path.resolve(__dirname, FILE_NAME), new_content);

  return {date: date, counter: counter};
};

ReleaseNotes.prototype.generateUpdateHeader = function generateUpdateHeader(type){

  return "<p><b><span style='color:OliveDrab'>" + type + " Update</span></b><br/><br/>";
};

ReleaseNotes.prototype.htmlForUpdates = function htmlForUpdates(updates){
  var str = "";
  var that = this;

      var updates_new = ReleaseNotes.aggregateType(updates);
      if (updates_new["Major"].length){
        str += that.generateUpdateHeader("Major");
         updates_new["Major"].forEach(function(item){
           str += that.generateSingleUpdate(item);
        });
      }

      if (updates_new["Minor"].length){
        str+= that.generateUpdateHeader("Minor");
        updates_new["Minor"].forEach(function(item){
          str +=  that.generateSingleUpdate(item);
        });
      }
    return str;
};

ReleaseNotes.prototype.aggregateType = function aggregateType(old_updates){
//Create a new array with order and aggregation based on the type of the updates.
var updates = {Major: [], Minor: []};
  old_updates.forEach(function(item){
    if (updates[item.feature_type] ){ //protection code from shit saved in the past
      updates[item.feature_type].push(item);
    }
  });

return updates;
};

//TODO - This needs to be a jade template
ReleaseNotes.prototype.generateHTML = function generateHTML(releaseNotes){
  var str = "Hi All,"
        + "<p style='line-height:11px;'><span>The upcoming deploy will include:</span>"
        + "<br/>";
  var that = this;

      str += ReleaseNotes.htmlForUpdates(releaseNotes.updates);

      str += "<br/>"
        + "<p>Enjoy!<br/><br/></p>"
        + "<p><b>see release notes history at:</b><br/>"
        + "<a href='"+cfg.global.url_showall+"'>"+cfg.global.url_showall+"</a>";
      str += "</p>";
  return str;
};

ReleaseNotes.prototype.generatePlainText = function generatePlainText(releaseNotes){
  return "plain text is now disabled.";
};

//TODO - This needs to be a jade template, also no need to change data from client, just use the sent data
ReleaseNotes.prototype.generateSingleUpdate = function generateSingleUpdate(update){
    var desc = update.update_description;
    var desc_str = (desc != "") ? (desc + "<br/>") : "";
    var update = "<b><span style='color:orange'>" + update.fix_or_new + "</span> " + update.update_title + "</b><br/>"
      + desc_str
      + "[Owner: " + update.owner + ", Developed by: " + update.developer + "]</p>";
      return update;
}

module.exports = exports = ReleaseNotes;

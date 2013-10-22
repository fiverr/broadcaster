  $(function() {
    $( "#date" ).datepicker({
      inline: true,
      defaultDate: new Date(),
      dateFormat: "d MM, y"
    });
    $("#date").datepicker('setDate', new Date());
    var date = new Date();
    var min =  date.getMinutes();
    min = (min < 10) ? "0" + min : min;
    var time_str = (date.getHours() + ":" + min).toString();  
    $("#time").val(time_str); 
  });

$(document).ready(function(){

    BROADCASTER.addItem(); //Add default entry

    //Show notification if any present
    var text = $(".alert-message").text();
    if (text.trim() !== ""){
      BROADCASTER.showNotification();
    }

  $("body").on("click", ".add_update", function(e){
    e.preventDefault();
    BROADCASTER.addItem();
  });

  $("body").on("click", ".delete_partial", function(e){
    e.preventDefault();
    BROADCASTER.removeItem();
  });

});

var BROADCASTER = {
  incr: 0,
  addItem: function(){
    $(".feature").append($("<div class='feature_item'>").load("/next_item?incr=" + BROADCASTER.incr++));
  },
  removeItem: function(obj){
    BROADCASTER.incr--;
    $(".feature_item").last().remove();
  },
  showNotification : function(){
    var text = $(".alert-message").text();
    $.pnotify({
      title: 'Notice',
      text: text ,
      type: "success",
      icon: false
    });
  }
};
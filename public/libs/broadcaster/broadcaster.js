  $(function() {
    $( "#date" ).datepicker({
      inline: true,
      defaultDate: new Date(),
      dateFormat: "d MM, y"
    });
    $("#date").datepicker('setDate', new Date());
    var now = (new Date().getHours() + ":00");
    $( "#time").val(now);
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


  //hack form the land of hacks
  $("td.content").each(function(item){
    var escaped_text = $(this).text();
    escaped_text = unescape(escaped_text);
    $(this).html(escaped_text);

  });

});

var BROADCASTER = {
  incr: 0,
  addItem: function(){
    $(".feature").append($("<div class='feature_item'>").load("/next_item?incr=" + BROADCASTER.incr++));
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
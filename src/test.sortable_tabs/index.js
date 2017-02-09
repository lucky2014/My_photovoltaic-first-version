define(function(require,exports,module){
    var $ = require("jquery");

    //小部件
    require("src/common.jui.widget/index");

    //base
    require("src/common.jui.base/index");

    //sortable
    require("src/common.jui.sortable/index");

    //tabs
    require("src/common.jui.tabs/index");

    //droppable
    require("src/common.jui.droppable/index");

    //标签页连接列表
    $( "#sortable11, #sortable22, #sortable33" ).sortable().disableSelection();
 
    var $tabs = $( "#tabs" ).tabs();
 
    var $tab_items = $( "ul:first li", $tabs ).droppable({
      accept: ".connectedSortable li",
      hoverClass: "ui-state-hover",
      drop: function( event, ui ) {
        var $item = $( this );
        var $list = $( $item.find( "a" ).attr( "href" ) )
          .find( ".connectedSortable" );
 
        ui.draggable.hide( "slow", function() {
          $tabs.tabs( "option", "active", $tab_items.index( $item ) );
          $( this ).appendTo( $list ).show( "slow" );
        });
      }
    });
});
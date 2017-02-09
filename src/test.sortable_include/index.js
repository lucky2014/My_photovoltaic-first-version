//放置占位符
//包含/排除某个项不能拖动
//不能拖放到空列表
define(function(require,exports,module){
    var $ = require("jquery");

    //小部件
    require("src/common.jui.widget/index");

    //base
    require("src/common.jui.base/index");

    //sortable
    require("src/common.jui.sortable/index");

    $( "#sortable1" ).sortable({
      items: "li:not(.ui-state-disabled)",
      placeholder: "ui-state-highlight"  //放置占位符
    });
 
    $( "#sortable2" ).sortable({
      cancel: ".ui-state-disabled"
    });
 
    $( "#sortable1 li, #sortable2 li" ).disableSelection();


    $( "ul.droptrue" ).sortable({
      connectWith: "ul"
    });
 
    $( "ul.dropfalse" ).sortable({
      connectWith: "ul",
      dropOnEmpty: false
    });
 
    $( "#emptyDrop #sortable1, #emptyDrop #sortable2, #emptyDrop #sortable3" ).disableSelection();
});
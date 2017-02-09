define(function(require,exports,module){
    var $ = require("jquery");

    //小部件
    require("src/common.jui.widget/index");

    //base
    require("src/common.jui.base/index");

    //sortable
    require("src/common.jui.sortable/index");

    //默认功能
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();

    //连接列表
    $( "#sortable1, #sortable2" ).sortable({
      connectWith: ".connectedSortable"
    }).disableSelection();
});
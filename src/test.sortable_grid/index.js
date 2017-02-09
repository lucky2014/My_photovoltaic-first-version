//通过时间延迟和距离延迟来防止意外的排序。通过 delay 选项设置开始排序之前必须拖拽的毫秒数。通过 distance 选项设置开始排序之前必须拖拽的像素数。
define(function(require,exports,module){
    var $ = require("jquery");

    //小部件
    require("src/common.jui.widget/index");

    //base
    require("src/common.jui.base/index");

    //sortable
    require("src/common.jui.sortable/index");

    $( "#sortable" ).sortable({
      delay: 300, //设置延迟时间 300ms
      //distance: 11 //设置延迟距离 15px
    });
    $( "#sortable" ).disableSelection();
});
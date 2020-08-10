
//当前被拖动元素(DOM对象)
var dragged;

//当前被拖动元素的标识(字符串)
var draggingElement;

//当前被拖动元素的对象副本
var dragEleCopyObj;

//当前被拖动元素的完整html
var dragEleCopyHtml;

//独一无二标记位
var listNum = 0;
var table1Num = 0;
var table2Num = 0;

//监听drag事件
document.addEventListener("drag", function (event) {

}, false);

//监听dragstart事件
document.addEventListener("dragstart", function (event) {
    //将当前被拖动元素赋值给全局变量dragged，以便其它函数使用
    dragged = event.target;

    //获取当前被拖动元素的html（包含父节点）
    if ($(event.target).parent().attr("id") == "model-name-content") {
        dragEleCopyHtml = $(event.target).prop("outerHTML");
    } else {
        dragEleCopyHtml = $(event.target).parent().prop("outerHTML");
    }

    console.log(dragEleCopyHtml);

    //获取当前被拖动元素的对象副本
    dragEleCopyObj = event.target;

    //拖动开始时，将被拖动元素透明度变为50%并增加虚线边框（对于有class="done"的元素，表明已经拖入，不再监听）
    if (!($(dragged).hasClass("done"))) {
        event.target.style.opacity = .5;
        event.target.style.border = "3px black dashed";
    }

    //判断被拖动元素的类型，从而给标识变量相应赋值
    //布局
    if (dragged.id == "list") {
        draggingElement = "list";
    }
    if (dragged.id == "table") {
        draggingElement = "table";
    }
    if (dragged.id == "table2") {
        draggingElement = "table2";
    }
    if (dragged.id == "cross") {
        draggingElement = "cross";
    }
    if (dragged.id == "mark") {
        draggingElement = "mark";
    }
    if (dragged.id == "text") {
        draggingElement = "text";
    }
    if (dragged.id == "space") {
        draggingElement = "space";
    }

}, false);

//监听dragenter事件，当拖拽元素进入目标元素的时候触发
document.addEventListener("dragenter", function (event) {

}, false);

//监听dragover事件
document.addEventListener("dragover", function (event) {
    //拖拽元素在目标元素上移动的时候，阻止事件冒泡，否则ondrop事件不会被触发
    if (!($(dragged).hasClass("done"))) {
        event.preventDefault();
    }
}, false);

var i = 2;
//监听drop事件
document.addEventListener("drop", function (event) {
    //编辑区右上角关闭按钮
    var delEle = $("<div class='delete'>X</div>");
    delEle.css({
        "z-index": "10",
        "display": "block",
        "color": "black",
        "width": "40px",
        "height": "40px",
        "top": "-10px",
        "right": "-7px",
        "position": "absolute",
        "text-align": "center",
        "line-height": "40px",
        "background": "orange",
        "border-radius": "50%"
    })
    //点击删除按钮移除当前元素
    delEle.click(function () {
        $(this).parent().remove();
    })

    if (!($(dragged).hasClass("done"))) {
        //阻止事件冒泡
        event.preventDefault();

        //只要drop了，无论发生在哪个区域，都应该去掉虚线边框
        $(dragged).css("border", "none");
        $(dragged).css("opacity", "1");

        //如果drop发生在屏幕预览区且拖动的是布局元素，对样式做如下处理
        if ($(event.target).hasClass("pane") && $(dragged).parent().parent().attr("id") == "layout-content") {
            $(dragged).addClass("done");
            $(dragged).css("width", "95%");
            event.target.appendChild(dragged);
        } else {
            //否则，如果目标元素不是屏幕预览区，不作处理
            if (!($(event.target).hasClass("pane"))) {

            } else {
                //否则，如果拖动元素不是布局元素，提示操作错误
                $('#layout-first-prompt').modal({
                    relatedTarget: this,
                    closeViaDimmer: 0
                });
            }
        }


        //如果拖拽的元素是“列表-list”且确定已经放置到屏幕预览区，作如下处理
        if (draggingElement == "list" && $(dragged).hasClass("done")) {
            //复制一个新的轮播布局元素放在面板中，以备后续使用
            $("#layout-content").append(dragEleCopyHtml);

            //重新定义被拖动元素的样式
            $(dragged).css({
                "border": "1px solid black",
                "background-color": "white",
                "background-image": "none",
                "box-shadow": "none",
                "font-size": "16px",
                "cursor": "pointer",
                "padding": "0",
                "width": "100%",
                "margin": "0px",
                "position": "relative",
            });

            //加入提示语和右上角关闭按钮
            $(dragged).html(`请输入列表行数
                                <br/>
                                <input type="text" id="list-row" />
                                <button id="list-submit">确定</button>
                            `);
            $(dragged).append(delEle);

            $("#list-submit").click(function(){
                listNum++;
                var row = $("#list-row").val();
                $(dragged).html("");

                var text1 = `<div style="font-size: 12px; padding-bottom: 10px;">
                                <ol style="padding-left: 20px;" id="add-list${listNum}">
                                </ol>
                            </div>`;
                $(dragged).append(delEle,text1);
                delEle.click(function(){
                    $(this).parent().remove();
                });
                for(var i = 0; i < row; i++) {
                    $(`#add-list${listNum}`).append("<li>列表行</li>")
                }
            });


        }

        //如果拖拽的元素是“表格(无表头)-table”且确定已经放置到屏幕预览区，作如下处理
        if (draggingElement == "table" && $(dragged).hasClass("done")) {
            //复制一个新的轮播布局元素放在面板中，以备后续使用
            $("#layout-content").append(dragEleCopyHtml);

            //重新定义被拖动元素的样式
            $(dragged).css({
                "border": "1px solid black",
                "background-color": "white",
                "background-image": "none",
                "box-shadow": "none",
                "font-size": "16px",
                "cursor": "pointer",
                "padding": "0",
                "width": "100%",
                "margin": "0px",
                "position": "relative",
            });

            //加入提示语和右上角关闭按钮
            $(dragged).html(`请输入行数
                                <input type="text" id="table1-row" /><br/>
                            请输入列数
                                <input type="text" id="table1-col" /><br/>
                                <button id="table1-submit">确定</button>
                            `);
            $(dragged).append(delEle,text1);

            $("#table1-submit").click(function(){
                table1Num++;
                var row = $("#table1-row").val();
                var col = $("#table1-col").val();
                $(dragged).html("");

                var text1 = `<table id="add-table1${table1Num}" cellspacing="0" style="width: 100%;">
                            </table>`;
                $(dragged).append(delEle,text1);
                delEle.click(function(){
                    $(this).parent().remove();
                });
                for(var i = 0; i < row; i++) {
                    $(`#add-table1${table1Num}`).append(`<tr style="width: ${100/col}%; height: 35px; line-height: 35px;"></tr>`);
                }
                for(var j = 0; j < col; j++) {
                    $(`#add-table1${table1Num}`).children(`tr`).append(`<td>单元格</td>`); 
                }
            });


        }

        //如果拖拽的元素是“表格(有表头)-table2”且确定已经放置到屏幕预览区，作如下处理
        if (draggingElement == "table2" && $(dragged).hasClass("done")) {
            //复制一个新的轮播布局元素放在面板中，以备后续使用
            $("#layout-content").append(dragEleCopyHtml);

            //重新定义被拖动元素的样式
            $(dragged).css({
                "border": "1px solid black",
                "background-color": "white",
                "background-image": "none",
                "box-shadow": "none",
                "font-size": "16px",
                "cursor": "pointer",
                "padding": "0",
                "width": "100%",
                "margin": "0px",
                "position": "relative"
            });

            //加入提示语和右上角关闭按钮
            $(dragged).html(`请输入行数(含表头)
                                <input type="text" id="table2-row" /><br/>
                            请输入列数
                                <input type="text" id="table2-col" /><br/>
                                <button id="table2-submit">确定</button>
                            `);
            $(dragged).append(delEle,text1);

            $("#table2-submit").click(function(){
                table2Num++;
                var row = $("#table2-row").val();
                var col = $("#table2-col").val();
                $(dragged).html("");

                var text1 = `<div style="padding-bottom: 10px">
                                <table id="add-table2${table2Num}" cellspacing="0" style="padding-top: 10px; width: 100%; border-collapse: collapse;">
                                </table>
                             </div>`;
                $(dragged).append(delEle,text1);
                delEle.click(function(){
                    $(this).parent().remove();
                });
                for(var i = 0; i < row; i++) {
                    if(i == 0) {
                        $(`#add-table2${table2Num}`).append(`<tr style="background-color: #409EFF; color: #FFF; height: 20px; line-height: 20px;"></tr>`);
                    } else {
                        $(`#add-table2${table2Num}`).append(`<tr style="text-align: center; background-color: #EEE; border-bottom: solid 1.5px #000;height: 25px;line-height: 25px;"></tr>`);
                    }
                    for(var j = 0; j < col; j++) {
                        if(i == 0) {
                            $(`#add-table2${table2Num}`).children(`tr:eq(${i})`).append(`<th>表头</th>`); 
                        } else {
                            $(`#add-table2${table2Num}`).children(`tr:eq(${i})`).append(`<td>单元格</td>`); 
                        }
                    }
                }
            });

        }

        //如果拖拽的元素是“横线-cross”且确定已经放置到屏幕预览区，作如下处理
        if (draggingElement == "cross" && $(dragged).hasClass("done")) {
            //复制一个新的轮播布局元素放在面板中，以备后续使用
            $("#layout-content").append(dragEleCopyHtml);

            //重新定义被拖动元素的样式
            $(dragged).css({
                "border": "1px solid black",
                "background-color": "white",
                "background-image": "none",
                "box-shadow": "none",
                "font-size": "16px",
                "cursor": "pointer",
                "padding": "0",
                "width": "100%",
                "margin": "0px",
                "position": "relative"
            });

            var text1 = `<hr style="height: 1.5px; background-color: #000; border: none;"/>`
            //加入提示语和右上角关闭按钮
            $(dragged).html("");
            $(dragged).append(delEle,text1);


        }

        //如果拖拽的元素是“医生签名区-mark”且确定已经放置到屏幕预览区，作如下处理
        if (draggingElement == "mark" && $(dragged).hasClass("done")) {
            //复制一个新的轮播布局元素放在面板中，以备后续使用
            $("#layout-content").append(dragEleCopyHtml);

            //重新定义被拖动元素的样式
            $(dragged).css({
                "border": "1px solid black",
                "background-color": "white",
                "background-image": "none",
                "box-shadow": "none",
                "font-size": "16px",
                "cursor": "pointer",
                "padding": "0",
                "width": "100%",
                "margin": "0px",
                "position": "relative"
            });

            var text1 = `<div style="position: relative;">
                            <table cellspacing="0" style="width: 100%;">
                                <tr style="height: 35px; width: 33%; line-height: 35px; padding: 5px 0;">
                                    <td colspan="2" >检测机构： 杭州甄元医学检验实验室</td>
                                </tr>
                                <tr style="height: 35px; width: 33%; line-height: 35px; padding: 5px 0;">
                                    <td >检验：</td>
                                    <td >审核：</td>
                                    <td >报告日期: </td>
                                </tr>
                                <tr style="height: 35px; width: 33%; line-height: 35px; padding: 5px 0;">
                                    <td >医生签名：</td>
                                    <td ></td>
                                    <td >发放日期：</td>
                                </tr>
                            </table>
                        </div>`
            //加入提示语和右上角关闭按钮
            $(dragged).html("");
            $(dragged).append(delEle,text1);


        }

        //如果拖拽的元素是“页面布局-文本”且确定已经放置到屏幕预览区，作如下处理
        if (draggingElement == "text" && $(dragged).hasClass("done")) {
            //复制一个新的文本布局元素放在面板中，以备后续使用
            $("#layout-content").append(dragEleCopyHtml);

            //重新定义被拖动元素的样式
            $(dragged).css({
                "border": "1px solid black",
                "background-color": "white",
                "background-image": "none",
                "box-shadow": "none",
                "font-size": "14px",
                "cursor": "pointer",
                "padding": "0",
                "width": "100%",
                "margin": "0px",
                "padding-bottom": "10px",
                "position": "relative"
            });

            //加入提示语和右上角关闭按钮
            $(dragged).html("文本区<br>(点击编辑文本内容)");
            $(dragged).append(delEle);

            //点击文本区配置参数
            $(dragged).on('click', function () {
                $('#add-text-prompt').css({
                    "display": "block",
                    "width": "500px"
                })             
            });
            $("#editor-cancel-btn").on('click', function(){
                $('#add-text-prompt').css("display","none");
            });
            $("#editor-confirm-btn").on('click', function(){
                $(dragged).css("color", "black");
                $(dragged).css("text-align", "left");
                //将ueditor中的内容追加至文本区内
                $(dragged).html(ue.getContent());
                $(dragged).append(delEle);
                //点击删除按钮移除当前元素
                delEle.click(function(){
                    $(this).parent().remove();
                })
                $('#add-text-prompt').css("display","none");
            });
        }

        //如果拖拽的元素是“页面布局-间距”且确定已经放置到屏幕预览区，作如下处理
        if (draggingElement == "space" && $(dragged).hasClass("done")) {
            //复制一个新的间距布局元素放在面板中，以备后续使用
            $("#layout-content").append(dragEleCopyHtml);

            //重新定义被拖动元素的样式
            $(dragged).css({
                "border": "1px solid black",
                "background-color": "white",
                "background-image": "none",
                "box-shadow": "none",
                "font-size": "14px",
                "cursor": "pointer",
                "height": "20px",
                "padding": "0",
                "width": "100%",
                "margin": "0px",
                "position": "relative"
            });

            //加入提示语和右上角关闭按钮
            $(dragged).html("间距区(点击编辑间距参数)");
            $(dragged).append(delEle);

            //点击间距区配置参数
            $(dragged).on('click', function () {
                $('#add-space-prompt').modal({
                    relatedTarget: this,
                    height: 170,
                    width: 500,
                    closeViaDimmer: 0,
                    onConfirm: function (e) {
                        var space = ($("#space-px").val() == "" || $("#space-px").val() < 20) ? "20" : $("#space-px").val();
                        $(dragged).css("height", space + "px");
                        /*$(dragged).html("间距区(当前间距：" + space + "px)<br>(点击编辑间距参数)");*/
                        $(dragged).html("间距区(点击编辑间距参数)");
                        $(dragged).append(delEle);
                        //点击删除按钮移除当前元素
                        delEle.click(function () {
                            $(this).parent().remove();
                        })
                    },
                    onCancel: function (e) {
                    }
                });
                return false;
            });
        }

    }

    //一次拖放事件完成，主动将标识用的全局变量重置
    draggingElement = "";
    dragEleCopyObj = "";
    dragEleCopyHtml = "";
}, false);

//监听dragend事件
document.addEventListener("dragend", function (event) {

}, false);

//监听dragleave事件
document.addEventListener("dragleave", function (event) {

}, false);



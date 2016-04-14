var Template = {
    /**
     * [getCheckChecked 获取复选框集合选中对象集合]
     * @param  {[string]} id [复选框组id]
     * @return {[obj array]}    [被勾选的对象]
     */
    getCheckChecked: function(id){
        var checkedArr = [];
        $.each($("#" + id + " .checkbox-square.checked"),function(i,item){
            checkedArr.push($(item).parent()[0]);
        });
        return checkedArr;
    },

    /**
     * [getRadioChecked 获取单选框集合选中对象]
     * @param  {[string]} id [复选框组id]
     * @return {[obj]}    [被勾选的对象]
     */
    getRadioChecked: function(id){
        return $("#" + id + " .icon-dot").parent().parent();
    },

    /**
     * [toastr 信息提醒控件]
     * @param  {[string]} msg [要提示的信息]
     * @return {[type]}     [description]
     */
    toastr: function(msg){
        alert(msg);
    },

    showMask: function(){
        if($(".mask").length === 0){
            $("body").append("<div class='mask'></div>");
        }else{
            $(".mask").show();
        }
        $("body").css("overflow","hidden");
    },

    /**
     * [hideMask 隐藏遮罩]
     * @return {[type]}    [description]
     */
    hideMask: function(id){
        $("body").css("overflow","auto");
        $(".mask").hide();
    },

    /**
     * [getLeft4Center 返回使元素居中的左偏移值]
     * @param  {[string]} selector [选择器]
     * @param  {[int]} offset   [偏移值，负数代表元素左移]
     * @return {[string]}          [使元素居中的左偏移值]
     */
    getLeft4Center: function(selector,offset){
        // 设置偏移量
        var _offset = offset || 0;
        // 获取屏幕的宽度
        var windowWidth = $(window).width();

        var left = (windowWidth-$(selector).outerWidth())/2 + _offset + "px";
        return left;
    },

    /**
     * [getTop4Middle 返回使元素居中的上偏移值]
     * @param  {[string]} selector [选择器]
     * @param  {[int]} offset   [偏移值，负数代表元素上移]
     * @return {[string]}          [使元素居中的上偏移值]
     */
    getTop4Middle: function(selector,offset){
        // 设置偏移量
        var _offset = offset || 0;
        // 获取屏幕的高度
        var windowHeight = $(window).height();

        var top = (windowHeight - $(selector).outerHeight())/2  + _offset +  "px" ;
        return top;
    },
    
    /**
     * [handleDatePicker 日期选择控件]
     * @param  {[string]} targetInputName [目标输入框的name属性值]
     * @param  {[string]} initVal         [初始化输入框的value,并初始化日期选择控件的日期]
     * @param  {[string]} title           [日期选择控件标题]
     * @return {[type]}                 [description]
     */
    handleDatePicker: function(targetInputName,initVal,title){
        // 日期
        var myDate = new Date();
        // 最小年份值
        var minYear = 1900;
        // 最大年份值-今年以后的30年
        var maxYear = myDate.getFullYear() + 30;
        // 最小月份值
        var minMonth = 1;
        // 最大月份值
        var maxMonth = 12;
        // 最小天数值
        var minDay = 1;
        // 月份集合-下标代表月份
        var monthSet = ["00","01","02","03","04","05","06","07","08","09","10","11","12"];
        // 每月最大天数集合-下标代表月份
        var maxDaySet = [0,31,28,31,30,31,30,31,31,30,31,30,31];

        // 日前选择控件标题
        var _title = title || "选择日期";

        /*var year = initVal.split(".")[0] || minYear;
        var month = initVal.split(".")[1] || monthSet[1];
        var day = initVal.split(".")[2] || maxDaySet[1];*/
        
        if(initVal == null || initVal == "") {
            initVal = Template.getCurrentDate();
        }
        
        var year = initVal.substring(0, 4) || minYear;
        var month = initVal.substring(4,6) || monthSet[1];
        var day = initVal.substring(6,8) || maxDaySet[1];

        initVal = year+"."+month+"."+day;
        // 初始化targetInputName输入框的值
        $("[name=" + targetInputName + "]").val(initVal);

        // 向content添加日期选择控件
        var initDatePicker = function(){
            var str = 
                "<div id=" + targetInputName + ">" +
                    "<div class='datePicker'>" +
                        "<div class='datePicker-title'>" + _title + "</div>" +
                        "<div class='datePicker-year'>" +
                            "<button class='datePicker-plus'>+</button>" +
                            "<input type='tel' name='datePicker-year' maxlength='4' value='" + year + "'>" +
                            "<button class='datePicker-minus'>-</button>" +
                        "</div>" +
                        "<div class='datePicker-month'>" +
                            "<button class='datePicker-plus'>+</button>" +
                            "<input type='tel' name='datePicker-month' maxlength='2' value='" + month + "'>" +
                            "<button class='datePicker-minus'>-</button>" +
                        "</div>" +
                        "<div class='datePicker-day'>" +
                            "<button class='datePicker-plus'>+</button>" +
                            "<input type='tel' name='datePicker-day' maxlength='2' value='" + day + "'>" +
                            "<button class='datePicker-minus'>-</button>" +
                       "</div>" +
                        "<button class='datePicker-confirm'>确认</button>" +
                    "</div>" +
                "</div>"
            ;
            $("#content").append(str);
        };

        // 格式校验
        var verify = function(name,val){
            
            val = parseInt(val,10);
            // 数字校验
            var reg = /^[0-9]+$/;
           
            if(name == "datePicker-year"){
                $("[name=datePicker-month]").val("01");
                $("[name=datePicker-day]").val("01");
                if(val < minYear || !reg.test(val)){
                    return maxYear;
                }else if(val > maxYear){
                    return minYear;
                }else{
                    return val;
                }
            }else if(name == "datePicker-month"){
                $("[name=datePicker-day]").val("01");
                if(val < minMonth || !reg.test(val)){
                    return maxMonth;
                }else if(val > maxMonth){
                    return "0" + minMonth;
                }else{
                    return monthSet[val];
                }
            }else{
                // 判断是否闰年
                var year = parseInt($("#" + targetInputName + " [name=datePicker-year]").val());
                var month = parseInt($("#" + targetInputName + " [name=datePicker-month]").val());
                if(year%4==0&&year%100!=0 || year%400==0){
                    // 闰二月为29天
                    maxDaySet[2] = 29;
                }else{
                    // 平二月为28天
                    maxDaySet[2] = 28;
                }

                if (val < minDay || !reg.test(val)) {
                    return maxDaySet[month];
                }else if(val > maxDaySet[month]){
                    return "0" + minDay;
                }else{
                    return (val >= 10) ? val:("0" + val);
                }
            }
        };

        // 居中对齐
        var setCenter = function(){
            var windowWidth = $(window).width();
            $("#" + targetInputName + " .datePicker").css("width",(windowWidth-40) + "px").css({
                "left": Template.getLeft4Center("#" + targetInputName + " .datePicker",0),
                "top": Template.getTop4Middle("#" + targetInputName + " .datePicker",-30)
            });

        };

        // 值+1
        var plus = function(name){
            var newVal = parseInt($("#" + targetInputName + " input[name=" + name + "]").val()) + 1;
            // 校验值的合法性
            newVal = verify(name,newVal);
            // 赋值
            $("#" + targetInputName + " input[name=" + name + "]").val(newVal);
        };

        // 值-1
        var minus = function(name){
            var newVal = parseInt($("#" + targetInputName + " input[name=" + name + "]").val()) - 1;
            // 校验值的范围
            newVal = verify(name,newVal);
            // 赋值
            $("#" + targetInputName + " input[name=" + name + "]").val(newVal);
        };

        var allBind = function(){
            // targetInputName所在输入框点击事件
            $("[name=" + targetInputName + "]").bind("click",function(){
                // 显示遮罩
                Template.showMask();
                // 获取输入框的值并设置日期控件的日期值
                var myTerm = $(this).val();
                var year = verify("datePicker-year",myTerm.split(".")[0]);
                var month = verify("datePicker-month",myTerm.split(".")[1]);
                var day = verify("datePicker-day",myTerm.split(".")[2]);
                $("#" + targetInputName + " [name=datePicker-year]").val(year);
                $("#" + targetInputName + " [name=datePicker-month]").val(month);
                $("#" + targetInputName + " [name=datePicker-day]").val(day);
                $("#" + targetInputName + " .datePicker").show();
            });

            // "+"按钮点击事件
            $("#" + targetInputName + " .datePicker-plus").bind("click",function(){
                var inputName = $(this).siblings("input").attr("name");
                plus(inputName);
            });

            // "-"按钮点击事件
            $("#" + targetInputName + " .datePicker-minus").bind("click",function(){
                var inputName = $(this).siblings("input").attr("name");
                minus(inputName);
            });
            
            // "确认"按钮点击事件
            $("#" + targetInputName + " .datePicker-confirm").bind("click",function(){
                var str = $("#" + targetInputName + " [name=datePicker-year]").val() + "." +
                          $("#" + targetInputName + " [name=datePicker-month]").val() + "." +
                          $("#" + targetInputName + " [name=datePicker-day]").val()
                ;
                $("[name=" + targetInputName + "]").val(str);
                $("#" + targetInputName + " .datePicker").hide();
                Template.hideMask();
            });

            // 年月日输入框blur事件
            $(".datePicker input").bind("blur",function(){
                var inputName = $(this).attr("name");
                var newVal = $(this).val();
                newVal = verify(inputName,newVal);
                $(this).val(newVal);
            });
        };

        // 调用
        initDatePicker();
        setCenter();
        allBind();
    },


    /**
     * [handleCheckbox 处理自定义复选框事件]
     * @return {[type]} [description]
     */
    handleCheckbox: function(){
        $(".checkboxSet-item").live("click",function(){
            $(this).find(".checkbox-square").toggleClass("checked").find("i").toggleClass("icon-nike");
        });
    },

    /**
     * [handleRadiobox 处理自定义单选框事件]
     * @return {[type]} [description]
     */
    handleRadiobox: function(){
        $(".radioboxSet-item").live("click",function(){
            $(this).parent().find("i").removeClass("icon-dot");
            $(this).find("i").addClass("icon-dot");
        });
    },

    /**
     * [handleSelect 自定义下拉框控件]
     * @param  {[string]} id      [下拉框id，同时也是input的name值]
     * @param  {[object]} dataObj [下拉框数据对象]
     * @param  {[string]} initVal [初始化input值，初始化下拉框checked值，可以为空]
     * @param  {[string]} initKey [初始化input值，初始化下拉框checked值，可以为空]
     * @param  {[function]} callFunc [下拉框选择后的回调函数]
     * @return {[type]}         [description]
     */
    handleSelect: function(id,dataObj,initVal,initKey,callFunc){
        /*dataObj = {
             type: "",
             list: [
                 {
                    key: "",
                    value: ""
                 },
                 {
                    key: "",
                    value: ""
                 }
             ]
        }*/
        // 获取屏幕高度
        var windowHeight = $(window).height();

        var dataInit = function(){
            // 删除旧select区域
            $("#" + id).remove();

            var str = "<div id='" + id + "'>" +
                        "<div class='selectSet'>" +
                            "<div class='selectSet-type'>" + dataObj['type'] + "</div>"
            ;
            $.each(dataObj['list'],function(i,item){
                var itemKey = item['key'];
                var itemVal = item['value'];
                str += "<div class='selectSet-item' key='" + itemKey + "'>" + itemVal + "</div>";
            });
            str += "</div></div>";
            $("#content").append(str);
            if(initKey != "" && initKey != undefined) {
                $.each(dataObj['list'],function(i,item){
                    var itemKey = item['key'];
                    var itemVal = item['value'];
                    if (itemKey == initKey) {
                        $("[name=" + id + "]").attr("key",itemKey).val(itemVal);
                        $("#" + id + " .selectSet-item[key=" + itemKey + "]").addClass("checked");
                        return false;
                    }
                });
            } else {
                // 初始化input的key属性和value值，初始化被选中的select
                if (initVal != "" && initVal != undefined) {
                    $.each(dataObj['list'],function(i,item){
                        var itemKey = item['key'];
                        var itemVal = item['value'];
                        if (itemVal == initVal) {
                            $("[name=" + id + "]").attr("key",itemKey).val(itemVal);
                            $("#" + id + " .selectSet-item[key=" + itemKey + "]").addClass("checked");
                            return false;
                        }
                    });
                }
            }
        };
        
        var setCenter = function(){
            var windowWidth = $(window).width();
            $("#" + id + " .selectSet").css("width",(windowWidth-40) + "px").css({
                "left": Template.getLeft4Center("#" + id + " .selectSet",0),
                "top": Template.getTop4Middle("#" + id + " .selectSet",-50)
            });
        };

        var getSelectedKey = function(){
            return $("#" + id + " .selectSet-item.checked").attr("key");
        };

        var getSelectedValue = function(){
            return $("#" + id + " .selectSet-item.checked").text();
        };

        // var scrollToSelected = function(){
        //     var scrollHeight = $("#" + id + " .selectSet").scrollTop();
        //     $("#" + id + " .selectSet").scrollTop(scrollHeight);
        // };

        var setInput = function(){
            $("[name=" + id + "]").attr("key",getSelectedKey()).val(getSelectedValue());
        };

        var allBind = function(){
            // 点击input父元素所在区域事件
            $("[name=" + id + "]").parent().bind("click",function(){
                Template.showMask();
                $("#" + id + " .selectSet").show();
            });

            // 点击下拉框条目事件
            $("#" + id + " .selectSet-item").bind("click",function(){
                $("#" + id + " .selectSet-item").removeClass("checked");
                $(this).addClass("checked");
                setTimeout(function(){
                   $("#" + id + " .selectSet").hide();
                   Template.hideMask();
                   setInput(); 
                   if(typeof(callFunc) === 'function') {
                    callFunc();
                   }
                },100);
                
            });
        };

        // 调用
        dataInit();
        setCenter();
        allBind();
    },

    /**
     * [getRandom 获取0-n的整数随机数]
     * @param  {[int]} n [随机数上限]
     * @return {[int]}   [随机数]
     */
    getRandom: function(n){
        return Math.floor(Math.random()*n+1);
    },

    getCurrentDate: function(){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + "" + month + "" + strDate;
        return currentdate;
    },
    
    /**
     * [blockUI 加入缓冲]
     * @return {[type]} [description]
     */
    blockUI: function(msg){
        msg = msg || "请稍等";
        if($(".blockUIWrapper").length == 0){
            $("body").append(
                "<div class='blockUIWrapper'>" +
                    "<div class='blockUI'>" +
                        "<img src='../img/loading_37.gif' alt='" + msg + "'>" +
                        "<span>" + msg + "</span>" +
                    "</div>" +
                "</div>"
            );
            $(".blockUI").css({
                top: Template.getTop4Middle(".blockUI",-20),
                 left: Template.getLeft4Center(".blockUI")
            });
        }else{
            $(".blockUIWrapper img").attr("alt",msg);
            $(".blockUIWrapper span").text(msg);
        }
        $(".blockUIWrapper").show();
        Template.showMask();
    },

    /**
     * [unblockUI 去掉缓冲]
     * @return {[type]} [description]
     */
    unblockUI: function(){
        $(".blockUIWrapper").hide();
        Template.hideMask();
    },

    safeKeyboard: function(selector,opts){
        // 配置项
        opts = $.extend({
            heading: "微信开户专属安全键盘",
            minlength: 0,
            maxlength: 6,
            random: true, //是否随机排列
        },opts);

        var numArr = [0,1,2,3,4,5,6,7,8,9];
        // 随机排序
        var randomSort = function(a,b){
            //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
            return Math.random()>.5 ? -1 : 1;
        };
        // 生成键盘
        var draw = function(){
            if (opts.random) {
                numArr = numArr.sort(randomSort);
                console.log(numArr); 
            }
            if($("#safeKeyboard").length === 0){
                var str = 
                    "<div id='safeKeyboard'>" +
                        "<div class='safeKeyboard-title'>" +
                            "<h3>" + opts.heading + "</h3>" +
                            "<i class='icon-select'></i>" +
                        "</div>" +
                        "<div class='safeKeyboard-inputArea'>" +
                            "<div class='safeKeyboard-inputArea-item'>" +
                                "<button class='safeKeyboard-btn-num' pos='0'>1</button>" +
                                "<button class='safeKeyboard-btn-num' pos='1'>2</button>" +
                                "<button class='safeKeyboard-btn-num' pos='2'>3</button>" +
                            "</div>" +
                            "<div class='safeKeyboard-inputArea-item'>" +
                                "<button class='safeKeyboard-btn-num' pos='3'>4</button>" +
                                "<button class='safeKeyboard-btn-num' pos='4'>5</button>" +
                                "<button class='safeKeyboard-btn-num' pos='5'>6</button>" +
                            "</div>" +
                            "<div class='safeKeyboard-inputArea-item'>" +
                                "<button class='safeKeyboard-btn-num' pos='6'>7</button>" +
                                "<button class='safeKeyboard-btn-num' pos='7'>8</button>" +
                                "<button class='safeKeyboard-btn-num' pos='8'>9</button>" +
                            "</div>" +
                            "<div class='safeKeyboard-inputArea-item'>" +
                                "<button class='safeKeyboard-btn' disabled></button>" +
                                "<button class='safeKeyboard-btn-num' pos='9'>0</button>" +
                                "<button id='safeKeyboard-btn-del' class='safeKeyboard-btn'>DEL</button>" +
                            "</div>" +
                        "</div>" + 
                    "</div>"    
                ;
                $("body").append(str);
                // 禁用输入法
                $(selector).attr("readonly","readonly");
                // 垂直居中
                // $("#safeKeyboard").css("top",Template.getTop4Middle("#safeKeyboard"));
            }
            $("#safeKeyboard h3").text(opts.heading);
            $.each(numArr,function(i,item){
                $($("#safeKeyboard .safeKeyboard-btn-num")[i]).text(numArr[i]);
            });
        };
        // 绑定target点击事件，绑定按键点击事件
        var allBind = function(){
            // 点击target输入框
            $(selector).on("click",function(){
                // 重新随机键盘或重绘键盘
                draw();
                Template.showMask();
                $("#safeKeyboard").show();
            });
            // 点击安全键盘数字按钮
            $("#safeKeyboard").on("click",".safeKeyboard-btn-num",function(){
                var old_input_val = $(selector).val();
                if (old_input_val.length>=opts.minlength && old_input_val.length<opts.maxlength) {
                    var new_input_val = old_input_val + "*";
                    var oldData = $(selector).data("pos_set") || "";
                    var newData = oldData + $(this).attr("pos");
                    $(selector).val(new_input_val);
                    $(selector).data("pos_set",newData);
                }
            });
            // 点击收起键盘
            $("#safeKeyboard .safeKeyboard-title").on("click",function(){
                $("#safeKeyboard").hide();
                Template.hideMask();
            });
            // 点击删除按钮
            $("#safeKeyboard-btn-del").on("click",function(){
                var old_input_val = $(selector).val();
                var new_input_val = old_input_val.substring(0,old_input_val.length-1);
                var oldData = $(selector).data("pos_set") || "";
                var newData = oldData.substring(0,oldData.length-1);
                $(selector).val(new_input_val);
                $(selector).data("pos_set",newData);
            });
        };
        return{
            init: function(){
                // 调用
                draw();
                allBind();
            },
            getData: function(){
                return $(selector).data("pos_set");
            }
        }
    },

    /**
     * [init description]
     * @return {[type]} [description]
     */
    init: function(){
        this.handleCheckbox();
        this.handleRadiobox();
    }
};
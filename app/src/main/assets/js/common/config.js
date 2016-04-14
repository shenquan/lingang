var Config = {
    error: function(method,response){
        if(response.error.message === "网页已过期，请返回首页"){
            Template.toastr(response.error.message);
            window.location.href = "prepare.html";
        }else if(response.error.hasOwnProperty('message')){
            Template.toastr(response.error.message);
        }else{
            Template.toastr(response.error);
        }
    },

    doMethodByNull: function(methodName, success, error) {
        error = error || Config.error;
    	$.jsonRPC.callService(methodName, success, error, "");
    },
    doMethodByJson: function(methodName, success, obj, error) {
        error = error || Config.error;
    	$.jsonRPC.callService(methodName, success, error, obj);
    },
    doMethodByParam: function(methodName, success, param, error) {
        error = error || Config.error;
    	$.jsonRPC.callService(methodName, success, error, param);
    },
    init: function(){
        var serviceUrl="http://192.168.191.8:9080/lg/services";
//        http://192.168.191.8:9080/lg/jsonrpcdemo.html
        var isCache = false;
        $.jsonRPC.init(serviceUrl,isCache);
    }
};
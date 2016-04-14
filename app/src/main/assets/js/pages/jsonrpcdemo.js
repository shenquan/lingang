var JsonrpcDemo = function() {
  var handleTest = function() {
	  var success = function(method,res) {
		  var result = res.result;
		  alert(JSON.stringify(result));
	  };
	  
	  Config.doMethodByNull("bikeService.getNearbyList", success);
  };
  
    return{
        init: function(){
        	handleTest();
        }
    };
}();
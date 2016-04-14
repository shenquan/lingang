(function($, undefined) {
  $.extend({
    jsonRPC: {
      // RPC Version Number
      version: '2.0',
      
      // End point URL, sets default in requests if not
      // specified with the request call
      endPoint: null,
      cache: false,
      // Default namespace for methods
      namespace: null,

      request: function(method, options) {
        if(options === undefined) {
          options = { id: 1 };
        }
        if (options.id === undefined) {
          options.id = 1;
        }
        if (options.cache === undefined) {
          options.cache = this.cache;
        }

        // Validate method arguments
        this._validateRequestMethod(method);
        this._validateRequestParams(options.params);
        this._validateRequestCallbacks(options.success, options.error);

        // Perform the actual request
        this._doRequest(JSON.stringify(this._requestDataObj(method, options.params, options.id)), options,method);

        return true;
      },
      init: function(serviceUrl, cache){
    	  if(serviceUrl)
    		  this.endPoint = serviceUrl;
    	  if(cache)
    		  this.cache = cache;
      },
      callService: function(method,success,error,params){
          var options = { 
        		  id: 1,
        		  cache: this.cache,
        		  success: success,
        		  error: error,
        		  endPoint:this.endPoint,
        		  params:[]
        		  };
          	for(var i=3;i<arguments.length;i++){
          		options.params[i-3]=arguments[i];
          	}
            // Validate method arguments
            this._validateRequestMethod(method);
            this._validateRequestParams(options.params);
            this._validateRequestCallbacks(options.success, options.error);

            // Perform the actual request
            this._doRequest(JSON.stringify(this._requestDataObj(method, options.params, options.id)), options,method);

            return true;   	  
      },
      
      // Validate a params hash
      _validateConfigParams: function(params) {
        if(params === undefined) {
          throw("No params specified");
        }
        else {
          if(params.endPoint && typeof(params.endPoint) !== 'string'){
            throw("endPoint must be a string");
          }
          if(params.namespace && typeof(params.namespace) !== 'string'){
            throw("namespace must be a string");
          }
        }
      },

      // Request method must be a string
      _validateRequestMethod: function(method) {
        if(typeof(method) !== 'string') throw("Invalid method supplied for jsonRPC request")
        return true;
      },

      // Validate request params.  Must be a) empty, b) an object (e.g. {}), or c) an array
      _validateRequestParams: function(params) {
        if(!(params === null ||
             params === undefined ||
             typeof(params) === 'object' ||
             $.isArray(params))) {
          throw("Invalid params supplied for jsonRPC request. It must be empty, an object or an array.");
        }
        return true;
      },

      _validateRequestCallbacks: function(success, error) {
        // Make sure callbacks are either empty or a function
        if(success !== undefined &&
           typeof(success) !== 'function') throw("Invalid success callback supplied for jsonRPC request");
        if(error !== undefined &&
         typeof(error) !== 'function') throw("Invalid error callback supplied for jsonRPC request");
        return true;
      },
	  _getExheader: function(tm){
		  	var result="";
			var tid="";
			if (document.cookie.length>0){
				var c_name="cid";
				var c_start=document.cookie.indexOf(c_name + "=");
				if (c_start!=-1){ 
				  	c_start=c_start + c_name.length+1 
				   	c_end=document.cookie.indexOf(";",c_start)
				if (c_end==-1) c_end=document.cookie.length
					tid = unescape(document.cookie.substring(c_start,c_end))
				} 
			}
			result=($.md5(tid+tm));
			return result;
	  },
      // Internal method used for generic ajax requests
      _doRequest: function(data, options,method) {
        var _that = this;
        var tm = new Date().getTime() +''+Math.floor(Math.random()*10000);
        var exHeader=  this._getExheader(tm);
        $.ajax({
          type: 'GET',
          async: false !== options.async,
          dataType: 'jsonp',
          jsonp: "jsonpCallback",//服务端用于接收callback调用的function名的参数  
          contentType: 'application/json ; charset=UTF-8',
          url: this._requestUrl((options.endPoint || options.url), options.cache,tm)+"&param="+data,
          data: data,
          cache: options.cache,
          processData: false,
          headers:{'Ex-h': exHeader},
          error: function(json) {
            _that._requestError.call(_that, json, options.error,method);
          },
          success: function(json) {
            _that._requestSuccess.call(_that, json, options.success, options.error,method);
          }
        })
      },

      // Determines the appropriate request URL to call for a request
      _requestUrl: function(url, cache,tm) {
        url = url || this.endPoint;
        if (!cache) {
            if (url.indexOf("?") < 0) {
              url += '?tm=' + tm;
            }
            else {
              url += "&tm=" + tm;
            }
        }
        return url;
      },

      // Creates an RPC suitable request object
      _requestDataObj: function(method, params, id) {
        var dataObj = {
          jsonrpc: this.version,
          method: this.namespace ? this.namespace +'.'+ method : method,
          id: id
        }
        if(params !== undefined) {
          dataObj.params = params;
        }
        return dataObj;
      },

      // Handles calling of error callback function
      _requestError: function(json, error,method) {
        if (error !== undefined && typeof(error) === 'function') {
          if(typeof(json.responseText) === 'string') {
            try {
              error(method,{error:{message:json.statusText,errorCode:json.status}});
            }
            catch(e) {
              error(method,this._response());
            }
          }
          else {
            error(method,this._response());
          }
        }
      },

      // Handles calling of RPC success, calls error callback
      // if the response contains an error
      // TODO: Handle error checking for batch requests
      _requestSuccess: function(json, success, error,method) {
        var response = this._response(json);

        // If we've encountered an error in the response, trigger the error callback if it exists
        if(response.error && typeof(error) === 'function') {
          error(method,response);
          return;
        }

        // Otherwise, successful request, run the success request if it exists
        if(typeof(success) === 'function') {
          success(method,response);
        }
      },

      // Returns a generic RPC 2.0 compatible response object
      _response: function(json) {
        if (json === undefined) {
          return {
            error: 'Internal server error',
            version: '2.0'
          };
        }
        else {
          try {
            if(typeof(json) === 'string') {
              json = eval ( '(' + json + ')' );
            }

            if (($.isArray(json) && json.length > 0 && json[0].jsonrpc !== '2.0') ||
                (!$.isArray(json) && json.jsonrpc !== '2.0')) {
              throw 'Version error';
            }

            return json;
          }
          catch (e) {
            return {
              error: 'Internal server error: ' + e,
              version: '2.0'
            }
          }
        }
      }

    }
  });
})(jQuery);
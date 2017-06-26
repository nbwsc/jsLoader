(function () {
	"use strict";
	if (window.JsLoader) {
		return;
	}
	window.JsLoader = {

        /**
         * Private object for caching the loaded components
         * @struct 
         *  {string}url:{bool}isLoaded
         * 
         */
		'_cache': {},

        /**
         * Private value origin 
         */
		'_origin': document.location.origin,

        /**
         * config to allow cross arigin load ;
         */
		'allowCrosArg': false,

        /**
         * Private method for logging if there is a console
         * @param {string} message - The string that needs to be outputted
         * @param {string} type - The method of the console. Can be: count, debug, dir,error,...
         */
		'_log': function (message, type) {
			var self = this;

			window.console = window.console || {};

			if (!type) {
				type = 'log';
			}

			if (window.console[type]) {
				window.console[type]('[JsLoader]' + message);
			}
		},


        /**
         * Private method for parse url
         * @param {string} url - The string to be parsed as url
         * @return {array} [url,protocal,host,pathname,search,hash]
         * 
         */
		'_parseUrl': function (url) {
			var reURLInformation = new RegExp([
				'^(https?:)//', // protocol
				'(([^:/?#]*)(?::([0-9]+))?)', // host (hostname and port)
				'(/{0,1}[^?#]*)', // pathname
				'(\\?[^#]*|)', // search
				'(#.*|)$' // hash
			].join(''));
			return url.match(reURLInformation);
		},

        /**
         * Private trim url to remove search part
         * @param {string} url 
         * @return {string}
         */
		'_trimUrl': function (url) {
			url = url.replace(new RegExp("^./"), '');
			return url && url.split('?')[0];
		},


        /**
         * Private method for check origin
         * @param {string} url
         * @return {boolean}
         */
		'_checkOrigin': function (url) {
			var self = this;

			var a = document.createElement('a');
			a.href = url;
			var targetOrigin = a.origin;

			return self.allowCrosArg ? true : targetOrigin === self._origin;
		},

        /**
         * Public mechod for load single file
         * @param {string} url - src to be loaded
         * @param {fn} onSuccess - success callback 
         * @param {fn} onError - error callback
         * 
         */
		'load': function (url, onSuccess, onError) {
			if (!url) {
				onError && onError();
				return;
			}
			var self = this;

			// check origin
			if (!self._checkOrigin(url)) {
				self._log('cross origin: ' + url, 'warn');
				onError && onError();
				return;
			}

			var trimedUrl = self._trimUrl(url);
			// check cache
			if (self._cache[trimedUrl]) {
				self._log(trimedUrl + ' already loaded');
				onError && onError();
				return;
			}

			var jsE = document.createElement('script');
			jsE.type = "text/javascript";
			jsE.src = url;

			// mount handlers
			jsE.onload = function () {
				self._log('load finished:' + url, 'debug');
				self._cache[trimedUrl] = true;
				onSuccess && onSuccess();
			};

			jsE.onerror = function () {
				self._log('load error:' + url, 'error');
				self._cache[trimedUrl] = false;
				onError && onError();
			};

			// load
			document.body.appendChild(jsE);

		},

        /**
         * Public method for load files
         * @param {[string]} urls - files to be loaded
         *                          support both relative path and absolute path
         *                          or one file url string 
         * @param {fn} onFinish - finish callback after load all files
         * @param {fn} onSuccess - success callback after load all files successful
         * @param {fn} onError - Error callback after load all files with error
         */
		'loadFiles': function (urls, onFinish, onSuccess, onError) {

			var self = this;

			var index = 0, n = 0, _errorFlag = false;

			function _load() {

				if (index >= n) {
					self._log('all files load finished');
					if (_errorFlag) {
						onError && onError();
					} else {
						onSuccess && onSuccess();
					}
					onFinish && onFinish();
					return;
				}

				self.load(urls[index++],
					function () {
						_load();
					},
					function () {
						_errorFlag = true;
						_load();
					}
				);

			}
			if (typeof urls === 'string') {
				self.load(urls);
			} else if (Array.isArray(urls)) {
				n = urls.length;
				_load(index);
			} else {
				self._log('Type error', error);
			}

		}

	}
})()

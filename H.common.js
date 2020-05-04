const qs = require('qs');
/**
* H helper functions available in both Servers and browsers
* @name H
*/
module.exports = (H) => {

	/**
	* Checks if variable is an array (equivalent to Array.isArray)
	* @memberof H
	* @param {Mixed} variable Variable to check
	* @returns {Boolean}
	*/
	H.isArray = Array.isArray;

	/**
	* Checks if variable is an object and not an array
	* @memberof H
	* @param {Mixed} variable Variable to check
	* @returns {Boolean}
	*/
	H.isObject = obj=>obj===Object(obj) && !H.isArray(obj);

	// Time
	/**
	* Wait for a number of miliseconds
	* @async
	* @memberof H
	* @param {Number} time Time in miliseconds
	* @returns {Promise}
	*/
	H.delay = (time) => new Promise(function(resolve, reject) {setTimeout(resolve, time);});
	/**
	* Returns current timestamp in miliseconds
	* @returns {Number} timestamp in miliseconds
	*/
	H.timestampMs = () => +new Date();
	/**
	* Returns current timestamp in seconds
	* @returns {Number} timestamp in seconds
	*/
	H.timestamp = () => Math.round(+new Date()/1000);
	/**
	* Converts a timestamp into relative time. E.g. about 2 hours ago; less than a minute; in about 5 minutes
	* @param {Number|Date} timestamp Time
	* @returns {String} relative representation of timestamp
	*/
	H.relativeTime = (timestamp) => {
		var seconds = Math.floor((new Date())/1000 - (parseInt(timestamp instanceof Date?(timestamp/1000):timestamp) || 0)),
			words = '',
			interval = 0,
			intervals = {
				year:   seconds / 31536000,
				month:  seconds / 2592000,
				day:	seconds / 86400,
				hour:   seconds / 3600,
				minute: seconds / 60
			};
		if(seconds == 0)
			words = 'now';
		else if (seconds>0) {
			var ranges = {
				minute:  'about a minute',
				minutes: '%d minutes',
				hour:	'about an hour',
				hours:   'about %d hours',
				day:	 'one day',
				days:	'%d days',
				month:   'about a month',
				months:  '%d months',
				year:	'about a year',
				years:   '%d years'
			};
			var distance = 'less than a minute';

			for (var key in intervals) {
				interval = Math.floor(intervals[key]);
				if (interval > 1) {
					distance = ranges[key + 's'];
					break;
				} else if (interval === 1) {
					distance = ranges[key];
					break;
				}
			}

			distance = distance.replace(/%d/i, interval);
			words += distance + ' ago';
		} else {
			seconds = Math.abs(seconds);
			var ranges = {
				minute:  'about a minute',
				minutes: '%d minutes',
				hour:	'about an hour',
				hours:   'about %d hours',
				day:	 '1 day',
				days:	'%d days',
			};
			var distance = 'less than a minute';

			for (var key in intervals) {
				interval = Math.floor(Math.abs(intervals[key]));
				if(!ranges.hasOwnProperty(key))
					continue;
				if (interval > 1) {
					distance = ranges[key + 's'];
					break;
				} else if (interval === 1) {
					distance = ranges[key];
					break;
				}
			}

			distance = distance.replace(/%d/i, interval);
			words += 'in '+distance;
		}

		return words.trim();
	};

	/**
	* Converts a string into a handlized format (uppercase letters, numbers and dashes)
	* @param {String} str String to handlize
	* @returns {String} Handle
	*/
	H.handlize = (str) => String(str).toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim().replace(/\s/g, '-');
	/**
	* Helper regular expressions (RegExp)
	* handle : Valid handle (lowercase letters, numbers, underscores and dashes).
	* email : Valid email address
	*/
	H.regexp = {
		handle	: /^[a-z0-9_-]+$/,
		email	: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	};
	/**
	* Escapes a regular expression string (RegExp)
	* s : String to escape
	*/
	H.regexpEscape = s=>s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	/**
	* Determines if an object has a property. (uses Object.prototype for security)
	* @param {Object} obj Object to check
	* @param {String} key Property to check
	* @returns {Bool} True if obj has the key property
	*/
	H.hasOwnProp = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

	/**
	* Goes through an object and returns value of a specific path (using dot notation)
	* @param {Object} obj Input object
	* @param {String} path Path to traverse (dot notation). e.g. parent.children.property
	* @returns {Mixed} Value of the path element
	*/
	H.getVariable = (obj, path) => {
		var pointer = obj;
		if(!pointer)
			return undefined;
		var failed = String(path).split('.').find((p) => {
			if(Object(pointer)===pointer && H.hasOwnProp(pointer, p))
				pointer = pointer[p];
			else
				return true;
		});
		if(typeof failed!='undefined')
			return undefined;
		return pointer;
	};
	/**
	* Goes through an object and sets the value of a specific path (using dot notation)
	* @param {Object} obj Input object
	* @param {String} path Path to traverse (dot notation). e.g. parent.children.property
	* @param {Mixed} value New value to inject
	*/
	H.setVariable = (obj, path, value) => {
		var pointer = obj;
		path = String(path).split('.');
		var last = path.pop();
		var n = path.length;
		var failed = path.find((p, i) => {
			if(!H.hasOwnProp(pointer, p))
				pointer[p] = {};
			if((Object(pointer[p])!==pointer[p] || Array.isArray(pointer[p])))
				pointer[p] = {};
			pointer = pointer[p];
		});
		pointer[last] = value;
		return true;
	};



	// HTML
	/**
	* Escapes a string for HTML injection
	* @param {String} str Input string
	* @returns {String} Cleaned output
	*/
	H.escape = (str) => {
		return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
	}







	// HTTP Requests
	/**
	* Requests an HTTP endpoint
	* @async
	* @param {String} method Method to use (GET|POST|PUT|DELETE|HEAD)
	* @param {String} url HTTP endpoint
	* @param {Object} payload Payload to inject (will be converted to query string in case of GET request otherwise, the payload is sent as a JSON body)
	* @param {Object} headers Headers to inject
	* @param {Object} extras extra options for the request (same as fetch API options)
	* @param {String} [inFormat="json"] Format of the input request (json|form).
	* @param {String} [outFormat="json"] Format of the output response (json|text|buffer|stream).
	* @returns {Promise<String>} Response body
	*/
	H.httpRequest = async (method, url, payload={}, headers={}, extras={}, inFormat='json', outFormat='json') => {
		var getPayload = '';
		if(method=='GET') {
			getPayload = '?'+qs.stringify(payload);
			if(getPayload=='?')
				getPayload = '';
		}
		var rethrow = false;
		try {
			var body = undefined;
			if(method!='GET') {
				if(inFormat=='json')
					body = JSON.stringify(payload);
				else if(inFormat=='form') {
					body = new URLSearchParams(qs.stringify(payload));
				}

			}
			if(inFormat=='json') {
				if(!headers['Content-Type'] && !headers['content-type'])
					headers['Content-Type'] = 'application/json';
				if(!headers['Accept'] && !headers['accept'])
					headers['Accept'] = 'application/json';
			}
			var response = await fetch(url+getPayload, {
				method,
				body,
				headers,
			});
			if(response.ok) {
				try {
					let contentType = (response.headers.get('content-type') || '').split(';').shift();
					if(outFormat=='json')// || contentType=='application/json')
						return await response.json(); // Expect all responses to be in JSON format
					else if (outFormat=='buffer')
						return await response.buffer();
					else if(outFormat=='stream')
						return response.body;
					return await response.text();
				} catch(e) {
					rethrow = true;
					throw new Error('The server returned an invalid response.');
				}
			} else {
				rethrow = true;
				if(response.status != 200)
					throw new H.Error('Error '+response.status+(response.statusText?': '+response.statusText:''));
				else
					throw new H.Error('A network error occured.');
			}
		} catch(e) {
			if(rethrow)
				throw e;
			throw new H.Error('Could not reach server. '+e.toString());
		}
	};
	/**
	* Requests a GET HTTP endpoint
	* @async
	* @param {String} url HTTP endpoint
	* @param {Object} payload Payload to inject will be converted to query string
	* @param {Object} headers Headers to inject
	* @param {Object} extras extra options for request (same as fetch API options)
	* @param {String} [inFormat="json"] Format of the input request (json|form).
	* @param {String} [outFormat="json"] Format of the output response (json|text|buffer|stream).
	* @returns {Promise<String>} Response body
	*/
	H.httpGet = async function(){return await H.httpRequest('GET', ...arguments);};
	/**
	* Requests a POST HTTP endpoint
	* @async
	* @param {String} url HTTP endpoint
	* @param {Object} payload Payload to inject
	* @param {Object} headers Headers to inject
	* @param {Object} extras extra options for request (same as fetch API options)
	* @param {String} [inFormat="json"] Format of the input request (json|form).
	* @param {String} [outFormat="json"] Format of the output response (json|text|buffer|stream).
	* @returns {Promise<String>} Response body
	*/
	H.httpPost = async function(){return await H.httpRequest('POST', ...arguments);};
	/**
	* Requests a PUT HTTP endpoint
	* @async
	* @param {String} url HTTP endpoint
	* @param {Object} payload Payload to inject
	* @param {Object} headers Headers to inject
	* @param {Object} extras extra options for request (same as fetch API options)
	* @param {String} [inFormat="json"] Format of the input request (json|form).
	* @param {String} [outFormat="json"] Format of the output response (json|text|buffer|stream).
	* @returns {Promise<String>} Response body
	*/
	H.httpPut = async function(){return await H.httpRequest('PUT', ...arguments);};
	/**
	* Requests a DELETE HTTP endpoint
	* @async
	* @param {String} url HTTP endpoint
	* @param {Object} payload Payload to inject
	* @param {Object} headers Headers to inject
	* @param {Object} extras extra options for request (same as fetch API options)
	* @param {String} [inFormat="json"] Format of the input request (json|form).
	* @param {String} [outFormat="json"] Format of the output response (json|text|buffer|stream).
	* @returns {Promise<String>} Response body
	*/
	H.httpDelete = async function(){return await H.httpRequest('DELETE', ...arguments);};







	class ErrorMessage extends Error {
		constructor(message, code=500) {
			super(message);
			this.errorMessage = message;
			this.statusCode = code;
		}
		toString() {
			return this.errorMessage;
		}
	}


	/**
	* Custom Error constructor
	* @param {String} message Error message
	* @param {Number} code Error code.
	*/
	H.Error = ErrorMessage;


}

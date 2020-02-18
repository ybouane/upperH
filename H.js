const fs = require('fs');
const qs = require('qs');
const util = require('util');
const readline = require('readline');
const stream = require('stream');
//const request = require('request');
const fetch = require('node-fetch');
const http = require('http');
const crypto = require('crypto');
const child_process = require('child_process');
const nunjucks = require('nunjucks');

var H = {};
module.exports = H;

// File / system
/**
* Reads a local file and returns a buffer
* @param {String} path File path
* @returns {Promise<Buffer>} Content of the file as a buffer
*/
H.readFileBuff = util.promisify(fs.readFile);
/**
* Reads a local file and returns it content as a string
* @param {String} path File path
* @returns {Promise<String>} Content of the file's content as a string
*/
H.readFile = async (...args) => (await util.promisify(fs.readFile)(...args)).toString();

/**
* Returns the list of files of a directory
* @param {String} path Path of the directory
* @returns {Promise<Array>} Directory list
*/
H.readDir = util.promisify(fs.readdir);
/**
* Writes a string into a file
* @param {String} path File path
* @param {String} content New file content
* @returns {Promise}
*/
H.writeFile = util.promisify(fs.writeFile);
/**
* Reads a local file (synchronously) and returns it content as a string
* @param {String} path File path
* @returns {String} Content of the file's content as a string
*/
H.readFileSync = (...args) => fs.readFileSync(...args).toString();
/**
* Writes a string into a file (synchronously)
* @param {String} path File path
* @param {String} content New file content
*/
H.writeFileSync = fs.writeFileSync;


/**
* Executes a child process
* @param {String} command Command to execute
* @param {Object} [options] Options (see child_process.exec)
* @returns {Promise<stdout, stderr>} Returns command output (stdout & stderr)
*/
H.exec = util.promisify(child_process.exec);


// Time
/**
* Wait for a number of miliseconds
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

var pid = process && process.pid ? process.pid.toString(36) : '';
/**
* Returns a random *unique* token
* @returns {String} Hexadecimal representation of token
*/
H.uniqueToken = () => crypto.createHash('md5').update(
	Math.random().toString(36).substr(2) + pid + Date.now().toString(36) + Math.random().toString(36).substr(2)
).digest("hex");

// Encryption
/**
* Returns MD5 hash
* @param {String|Buffer} str Input to get hash of
* @returns {String} MD5 hash of input (in HEX format)
*/
H.md5 = (str) => crypto.createHash('md5').update(String(str), 'utf8').digest('hex');
/**
* Returns SHA1 hash
* @param {String|Buffer} str Input to get hash of
* @returns {String} SHA1 hash of input (in HEX format)
*/
H.sha1 = (str) => crypto.createHash('sha1').update(String(str), 'utf8').digest('hex');
/**
* Returns SHA256 hash
* @param {String|Buffer} str Input to get hash of
* @returns {String} SHA256 hash of input (in HEX format)
*/
H.sha256 = (str) => crypto.createHash('sha256').update(String(str), 'utf8').digest('hex');

/**
* Encrypts an input string with aes-256-cbc encryption algorithm
* @param {String|Buffer} data Input data to encrypt
* @param {String} key Encryption key in HEX format. Must be a 32byte key for a 256bit algorithm.
* @param {String} iv IV to use for the encryption in HEX format. For AES, length must be 16
* @param {String} [algo="aes-256-cbc"] Encryption algorithm
* @param {String} [format="hex"] Format of output
* @example
* const key = crypto.scryptSync('Password here', 'salt', 32).toString('hex'); // 32 = 256/8
* const iv = Buffer.from('d65a8b0dcbde0b76cc746faaf0b0beaa', 'hex'); // For AES, length is 16
* var encryptedData = H.encrypt('My secret data', key, iv);
* @returns {String|Buffer} Encrypted data
*/
H.encrypt = (data, key, iv, algo='aes-256-cbc', format='hex') => {
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
	let encrypted = cipher.update(data);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return encrypted.toString(format);
}
/**
* Decrypts an input string with aes-256-cbc encryption algorithm
* @param {String|Buffer} data Input data to decrypt
* @param {String} key Decryption key in HEX format. Must be a 32byte key for a 256bit algorithm.
* @param {String} iv IV to use for the decryption in HEX format. For AES, length must be 16
* @param {String} [algo="aes-256-cbc"] Decryption algorithm
* @param {String} [format="hex"] Format of output
* @example
* const key = crypto.scryptSync('Password here', 'salt', 32).toString('hex'); // 32 = 256/8
* const iv = Buffer.from('d65a8b0dcbde0b76cc746faaf0b0beaa', 'hex'); // For AES, length is 16
* var originalData = H.encrypt(encryptedData, key, iv);
* @returns {String|Buffer} Encrypted data
*/
H.decrypt = (data, key, iv, algo='aes-256-cbc', format='hex') => {
	let encryptedText = Buffer.from(data, format);
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
};


/**
* Renders a nunjucks/jinja template string asynchronously
* @param {String} str Template string (jinja/nunjucks)
* @param {Object} data Data to inject in template
* @param {Object} filters Filters functions to allow in template
* @param {Function} includeCb Callback function that is called whenever the template calls the include instruction.
* @returns {Promise<String>} Rendered template
*/
H.render = async (str, data, filters={}, includeCb) => {
	var loader;
	if(includeCb) {
		loader = {
			async		: false,
			getSource	: includeCb,/*function(name, cb) {
				includeCb(name).then(cb);
			},*/
		};
	}
	var env = new nunjucks.Environment(loader, {
		throwOnUndefined : false,
	});
	for(let [name, cb] of Object.entries(filters))
		env.addFilter(name, cb, cb.constructor.name === 'AsyncFunction');
	return new Promise(function(resolve, reject) {
		env.renderString(str, data, (err, res) => {
			if(err)
				return reject(err);
			resolve(res);
		});
	});
};
/**
* Renders a nunjucks/jinja template file asynchronously
* @param {String} str Path of template file to render
* @param {Object} data Data to inject in template
* @param {Object} filters Filters functions to allow in template
* @param {Function} includeCb Callback function that is called whenever the template calls the include instruction.
* @returns {Promise<String>} Rendered template
*/
H.renderFile = async (file, ...args) => {
	return await H.render(await H.readFile(file), ...args);
};

/**
* Converts a string into a handlized format (uppercase letters, numbers and dashes)
* @param {String} str String to handlize
* @returns {String} Handle
*/
H.handlize = (str) => String(str).toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim().replace(/\s/g, '-');
/**
* Helper REGEX expressions
* handle : Valid handle (lowercase letters, numbers, underscores and dashes).
* email : Valid email address
*/
H.regexp = {
	handle	: /^[a-z0-9_-]+$/,
	email	: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
};
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



// CLI input
/**
* Requests input from user in command line interface
* @param {String} q Question to ask to user during input
* @param {Boolean} [muted=false] Whether to mute the user input (for passwords)
* @returns {String} the value the user has entered
*/
H.input = async (q, muted=false) => {
	const rl = readline.createInterface({
		input	: process.stdin,
		output	: muted?new stream.Writable({
			write	: (chunk, encoding, callback) => {callback()}
		}):process.stdout,
		terminal: true
	});
	return new Promise(function(resolve, reject) {
		if(muted)
			console.log(q);
		rl.question(q, (answer) => {
			rl.close();
			resolve(answer);
		});
	});
};

/**
* Shortcut for H.input but without the muted parameter set to true
* @param {String} q Question to ask to user during input
* @returns {String} the value the user has entered
*/
H.waitForKey = async (q='') => {
	return await input(q, true);
};

var keyPressCallbacks = [];
/**
* Listens to keypresses and calls callback when a key is pressed. Exists when Ctrl+C is typed
* @param {Function} cb Callback to function that will listen to key presses
*/
H.onKeypress = (cb) => {
	if(keyPressCallbacks.length==0) { // Init
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);
		process.stdin.on('keypress', (key, data) => {
			if(data.ctrl && data.name=='c') {
				process.exit();
				return;
			}
			for(let cb of keyPressCallbacks)
				cb(key, data);
		});
	}
	keyPressCallbacks.push(cb);
};





// HTTP Requests
/**
* Requests an HTTP endpoint
* @param {String} method Method to use (GET|POST|PUT|DELETE|HEAD)
* @param {String} url HTTP endpoint
* @param {Object} payload Payload to inject (will be converted to query string in case of GET request otherwise, the payload is sent as a JSON body)
* @param {Object} headers Headers to inject
* @param {Object} extras extra options for the request (same as fetch API options)
* @param {String} [format="json"] Format of the request (json|form|buffer).
* @returns {Promise<String>} Response body
*/
H.httpRequest = async (method, url, payload={}, headers={}, extras={}, format='json') => {
	var getPayload = '';
	if(method=='GET') {
		getPayload = '?'+qs.stringify(payload);
		if(getPayload=='?')
			getPayload = '';
	}
	try {
		var body = undefined;
		if(method!='GET') {
			if(format=='json')
				body = JSON.stringify(payload);
			else if(format=='form') {
				body = new URLSearchParams(qs.stringify(payload));
			}

		}
		if(format=='json') {
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
				if(format=='json' || contentType=='application/json')
					return await response.json(); // Expect all responses to be in JSON format
				else if (format=='buffer')
					return await response.buffer();
				return await response.text();
			} catch(e) {
				throw new Error('The server returned an invalid response.');
			}
		} else {
			if(response.status != 200)
				throw new H.Error('Error '+response.status+(response.statusText?': '+response.statusText:''));
			else
				throw new H.Error('A network error occured.');
		}
	} catch(e) {
		throw new H.Error('Could not reach server. '+e.toString());
	}
};
/**
* Requests a GET HTTP endpoint
* @param {String} url HTTP endpoint
* @param {Object} payload Payload to inject will be converted to query string
* @param {Object} headers Headers to inject
* @param {Object} extras extra options for request (same as fetch API options)
* @param {String} [format="json"] Format of the request (json|form|buffer).
* @returns {Promise<String>} Response body
*/
H.httpGet = async function(){return await H.httpRequest('GET', ...arguments);};
/**
* Requests a POST HTTP endpoint
* @param {String} url HTTP endpoint
* @param {Object} payload Payload to inject
* @param {Object} headers Headers to inject
* @param {Object} extras extra options for request (same as fetch API options)
* @param {String} [format="json"] Format of the request (json|form|buffer).
* @returns {Promise<String>} Response body
*/
H.httpPost = async function(){return await H.httpRequest('POST', ...arguments);};
/**
* Requests a PUT HTTP endpoint
* @param {String} url HTTP endpoint
* @param {Object} payload Payload to inject
* @param {Object} headers Headers to inject
* @param {Object} extras extra options for request (same as fetch API options)
* @param {String} [format="json"] Format of the request (json|form|buffer).
* @returns {Promise<String>} Response body
*/
H.httpPut = async function(){return await H.httpRequest('PUT', ...arguments);};
/**
* Requests a DELETE HTTP endpoint
* @param {String} url HTTP endpoint
* @param {Object} payload Payload to inject
* @param {Object} headers Headers to inject
* @param {Object} extras extra options for request (same as fetch API options)
* @param {String} [format="json"] Format of the request (json|form|buffer).
* @returns {Promise<String>} Response body
*/
H.httpDelete = async function(){return await H.httpRequest('DELETE', ...arguments);};


// HTTP Server
/**
* Starts an HTTP server and calls specific handlers depending on request url
* @param {Number} [post=80] Post to listen to
* @param {Function|Object} handlers If function, it will run function and use returned Object to select handler. If Object, it will use it directly to select the handler. The handler is selected if it matches the request url. If the handler's key starts with ^, it will be considered as a REGEX.
* @param {Object} options Extra options. defaultHandler, onError, beforeHandler, pathFlags, afterHandler, autoEnd, maxPostRequestSize,
*/
H.httpServer = (port=80, handlers, options) => {
	options = options || {};
	if(!options.defaultHandler) {
		options.defaultHandler = async (req, res) => {
			if(res.useJSON) {
				res.json({success:false, message:'404 Error'}, 404);
			} else {
				res.writeHead(404, {'Content-Type': 'text/html'});
				res.end('<h1>404 Error</h1>');
			}
		};
	}
	if(!options.onError) {
		options.onError = (err, req, res) => {
			console.error(err);
			if(res) {
				if(res.useJSON) {
					if(!res.headersSent)
						res.writeHead(500, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({success:false, message:'500 Error:'+err.toString()}));
				} else {
					if(!res.headersSent)
						res.writeHead(500, {'Content-Type': 'text/html'});
					res.end('500 Error: '+err.toString());
				}
			}
		};
	}
	var server = http.createServer();
	server.on('request', async (request, response) => {
		try {
			response.useJSON = false;
			if(request.headers.accept && request.headers.accept.toLowerCase()=='application/json') {
				response.useJSON = true;
			}
			response.json = (data, status=200) => {
				response.writeHead(status, {'Content-Type': 'application/json'});
				response.end(JSON.stringify(data));
			};
			let url = new URL(request.url, 'https://example.com/');

			let callback = async (data) => {
				options.beforeHandler && await options.beforeHandler(request, response, undefined, request.method, data);
				var matched = false;
				var handlers_ = handlers;
				if({}.toString.call(handlers) === '[object Function]')
					handlers_ = handlers(request, response, request.method, data);
				else if({}.toString.call(handlers) === '[object AsyncFunction]')
					handlers_ = await handlers(request, response, request.method, data);

				for(let [path, handler] of Object.entries(handlers_)) {
					matched = path.indexOf('^')==0 && url.pathname.match(new RegExp(path, options.pathFlags || ''));
					if(matched) {
						await handler(request, response, matched, request.method, data);
						break;
					} else if(path==url.pathname) {
						await handler(request, response, undefined, request.method, data);
						matched = true;
						break;
					}
				}
				if(!matched)
					await options.defaultHandler(request, response);
				options.afterHandler && await options.afterHandler(request, response, undefined, request.method, data);
				handlers_['//AFTER_HANDLER'] && await handlers_['//AFTER_HANDLER'](request, response, undefined, request.method, data);

				if(options.autoEnd!==false && !response.writableEnded) {
					response.end();
				}
			}

			if (request.method == 'POST' || request.method == 'PUT' || request.method == 'DELETE') {
				var body = '';
				request.on('data', function (data) {
					body += data;

					// Flood attack / request is too large:
					if (body.length > (options.maxPostRequestSize || 1024*1024*5)) { // 5MB default
						throw new H.Error('Request is too large.', 413);
					}
				});
				request.on('end', async function () {

					if(request.headers['content-type'] && request.headers['content-type'].toLowerCase() == 'application/json') {
						try {
							body = JSON.parse(body);
						} catch(e) {
							throw new H.Error('Invalid request.', 400);
						}
					}
					try {
						await callback(body);
					} catch(e) {
						await options.onError(e, request, response, undefined, request.method);
						if(options.autoEnd!==false && !response.writableEnded) {
							response.end();
						}
					}
				});
			} else {
				var body = qs.parse(url.search, {plainObjects: true, ignoreQueryPrefix: true});
				await callback(body);
			}

		} catch(e) {
			await options.onError(e, request, response, undefined, request.method);
			if(options.autoEnd!==false && !response.writableEnded) {
				response.end();
			}
		}
	});
	server.on('error', async (e) => {
		await options.onError(e);
		if(options.autoEnd!==false && !response.writableEnded) {
			response.end();
		}
	});
	server.listen(port);
};





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

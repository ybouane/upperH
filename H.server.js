const fs = require('fs');
const qs = require('qs');
const util = require('util');
const readline = require('readline');
const stream = require('stream');
const fetch = require('node-fetch');
const http = require('http');
const crypto = require('crypto');
const child_process = require('child_process');
const nunjucks = require('nunjucks');
/**
* H helper functions available only for Servers
* @name HServer
* @typicalname H
*/
const H = {};

module.exports = H;


require('./H.common.js')(H);




// File / system
/**
* Reads a local file and returns a buffer
* @async
* @memberof HServer
* @param {String} path File path
* @returns {Promise<Buffer>} Content of the file as a buffer
* @name readFileBuff
*/
H.readFileBuff = util.promisify(fs.readFile);
/**
* Reads a local file and returns it content as a string
* @async
* @memberof HServer
* @param {String} path File path
* @returns {Promise<String>} Content of the file's content as a string
* @name readFile
*/
H.readFile = async (...args) => (await util.promisify(fs.readFile)(...args)).toString();

/**
* Returns the list of files of a directory
* @async
* @memberof HServer
* @param {String} path Path of the directory
* @returns {Promise<Array>} Directory list
* @name readDir
*/
H.readDir = util.promisify(fs.readdir);
/**
* Creates a directory
* @async
* @memberof HServer
* @param {String} path Path of the directory
* @returns {Promise}
* @name mkdir
*/
H.mkdir = util.promisify(fs.mkdir);
/**
* Writes a string into a file
* @async
* @memberof HServer
* @param {String} path File path
* @param {String} content New file content
* @returns {Promise}
* @name writeFile
*/
H.writeFile = util.promisify(fs.writeFile);
/**
* Reads a local file (synchronously) and returns it content as a string
* @memberof HServer
* @param {String} path File path
* @returns {String} Content of the file's content as a string
* @name readFileSync
*/
H.readFileSync = (...args) => fs.readFileSync(...args).toString();
/**
* Writes a string into a file (synchronously)
* @memberof HServer
* @param {String} path File path
* @param {String} content New file content
* @name writeFileSync
*/
H.writeFileSync = fs.writeFileSync;


/**
* Executes a child process
* @async
* @memberof HServer
* @param {String} command Command to execute
* @param {Object} [options] Options (see child_process.exec)
* @returns {Promise<stdout, stderr>} Returns command output (stdout & stderr)
* @name exec
*/
H.exec = util.promisify(child_process.exec);


var pid = process && process.pid ? process.pid.toString(36) : '';
/**
* Returns a random *unique* token
* @memberof HServer
* @returns {String} Hexadecimal representation of token
* @name uniqueToken
*/
H.uniqueToken = () => crypto.createHash('md5').update(
	Math.random().toString(36).substr(2) + pid + Date.now().toString(36) + Math.random().toString(36).substr(2)
).digest("hex");

// Encryption
/**
* Returns MD5 hash
* @memberof HServer
* @param {String|Buffer} str Input to get hash of
* @returns {String} MD5 hash of input (in HEX format)
* @name md
*/
H.md5 = (str) => crypto.createHash('md5').update(String(str), 'utf8').digest('hex');
/**
* Returns SHA1 hash
* @memberof HServer
* @param {String|Buffer} str Input to get hash of
* @returns {String} SHA1 hash of input (in HEX format)
* @name sha
*/
H.sha1 = (str) => crypto.createHash('sha1').update(String(str), 'utf8').digest('hex');
/**
* Returns SHA256 hash
* @memberof HServer
* @param {String|Buffer} str Input to get hash of
* @returns {String} SHA256 hash of input (in HEX format)
* @name sha
*/
H.sha256 = (str) => crypto.createHash('sha256').update(String(str), 'utf8').digest('hex');

/**
* Encrypts an input string with aes-256-cbc encryption algorithm
* @memberof HServer
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
* @name encrypt
*/
H.encrypt = (data, key, iv, algo='aes-256-cbc', format='hex') => {
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
	let encrypted = cipher.update(data);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return encrypted.toString(format);
}
/**
* Decrypts an input string with aes-256-cbc encryption algorithm
* @memberof HServer
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
* @name decrypt
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
* @async
* @memberof HServer
* @param {String} str Template string (jinja/nunjucks)
* @param {Object} data Data to inject in template
* @param {Object} filters Filters functions to allow in template
* @param {Function} includeCb Callback function that is called whenever the template calls the include instruction.
* @returns {Promise<String>} Rendered template
* @name render
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
* @async
* @memberof HServer
* @param {String} str Path of template file to render
* @param {Object} data Data to inject in template
* @param {Object} filters Filters functions to allow in template
* @param {Function} includeCb Callback function that is called whenever the template calls the include instruction.
* @returns {Promise<String>} Rendered template
* @name renderFile
*/
H.renderFile = async (file, ...args) => {
	return await H.render(await H.readFile(file), ...args);
};



// CLI input
/**
* Requests input from user in command line interface
* @async
* @memberof HServer
* @param {String} q Question to ask to user during input
* @param {Boolean} [muted=false] Whether to mute the user input (for passwords)
* @returns {Promise<String>} the value the user has entered
* @name input
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
* @memberof HServer
* @param {String} q Question to ask to user during input
* @returns {String} the value the user has entered
* @name waitForKey
*/
H.waitForKey = async (q='') => {
	return await input(q, true);
};

var keyPressCallbacks = [];
/**
* Listens to keypresses and calls callback when a key is pressed. Exists when Ctrl+C is typed
* @memberof HServer
* @param {Function} cb Callback to function that will listen to key presses
* @name onKeypress
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


// HTTP Server
/**
* Starts an HTTP server and calls specific handlers depending on request url
* @memberof HServer
* @param {Number} [post=80] Post to listen to
* @param {Function|Object} handlers If function, it will run function and use returned Object to select handler. If Object, it will use it directly to select the handler. The handler is selected if it matches the request url. If the handler's key starts with ^, it will be considered as a REGEX.
* @param {Object} options Extra options. defaultHandler, onError, beforeHandler, pathFlags, afterHandler, autoEnd, maxPostRequestSize,
* @name httpServer
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
					handlers_ = handlers(request, response, undefined, request.method, data);
				else if({}.toString.call(handlers) === '[object AsyncFunction]')
					handlers_ = await handlers(request, response, undefined, request.method, data);

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

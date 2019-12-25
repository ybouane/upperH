const fs = require('fs');
const util = require('util');
const readline = require('readline');
const stream = require('stream');
const request = require('request');
const crypto = require('crypto');
const child_process = require('child_process');



// File / system
module.exports.readFileBuff = util.promisify(fs.readFile);
module.exports.readFile = async (...args) => (await util.promisify(fs.readFile)(...args)).toString();
module.exports.readDir = util.promisify(fs.readdir);
module.exports.writeFile = util.promisify(fs.writeFile);

module.exports.exec = util.promisify(child_process.exec);


// Time
module.exports.delay = (time) => new Promise(function(resolve, reject) {setTimeout(resolve, time);});
module.exports.timestampMs = () => +new Date();
module.exports.timestamp = () => Math.round(+new Date()/1000);


// Encryption
module.exports.md5 = (str) => crypto.createHash('md5').update(str, 'utf8').digest('hex');
module.exports.sha1 = (str) => crypto.createHash('sha1').update(str, 'utf8').digest('hex');
module.exports.sha256 = (str) => crypto.createHash('sha256').update(str, 'utf8').digest('hex');

module.exports.encrypt = (data, key, iv, algo='aes-256-cbc', format='hex') => {
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
	let encrypted = cipher.update(data);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return encrypted.toString(format);
}

module.exports.decrypt = (data, key, iv, algo='aes-256-cbc', format='hex') => {
	let encryptedText = Buffer.from(data, format);
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}


// CLI input
module.exports.input = async (q, muted=false) => {
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

module.exports.waitForKey = async (q='') => {
	return await input(q, true);
};



// HTTP Requests
module.exports.httpRequest = async (method, url, payload={}, headers={}, extras={}) => {
	return new Promise(async (resolve, reject) => {
		request({
				url		: url,
				method	: 'GET',
				...(method=='GET'?
					{qs : payload}:
					{body : payload}
				),
				json	: true,
				headers	: headers,
				...extras
			}, (error, response, body) => {
			if(error)
				reject(error);
			else if(!response)
				reject('No response');
			else if (response.statusCode!=200)
				reject('Error: Status code='+response.statusCode);
			else
				resolve(body);
		});
	});
};
module.exports.httpGet = async () => module.exports.httpRequest('GET', ...arguments);
module.exports.httpPost = async () => module.exports.httpRequest('POST', ...arguments);
module.exports.httpPut = async () => module.exports.httpRequest('PUT', ...arguments);
module.exports.httpDelete = async () => module.exports.httpRequest('DELETE', ...arguments);

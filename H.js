const fs = require('fs');
const util = require('util');
const readline = require('readline');
const stream = require('stream');
const request = require('request');
const child_process = require('child_process');


module.exports.readFile = util.promisify(fs.readFile);
module.exports.readDir = util.promisify(fs.readdir);
module.exports.writeFile = util.promisify(fs.writeFile);

module.exports.exec = util.promisify(child_process.exec);

module.exports.delay = (time) => new Promise(function(resolve, reject) {setTimeout(resolve, time);});

module.exports.encrypt = (text, key, iv, algo='aes-256-cbc', format='hex') => {
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return encrypted.toString(format);
}

module.exports.decrypt = (data, key, iv, algo='aes-256-cbc', format='hex') => {
	let encryptedText = Buffer.from(text, format);
	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}


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

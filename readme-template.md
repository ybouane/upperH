# upperH

upperH is a collection of helper functions to make starting a nodeJS project faster.

# Get started

## Install
```
npm install upperh --save
```

## How to use - Server

```
const H = require('upperh');


(async () => {

	// Your program here:

	var name = await H.input('What is your name?');
	var password = await H.input('Password: ', true); // input is muted (not displayed)

	await H.delay(2000); // Wait 2 seconds

	var fileContent = await H.readFile('myfile.txt');

	await H.writeFile('myfile-copy.txt', fileContent);



})();
```

## How to use - Browser

```
const H = require('upperh');


H(async () => { // Will execute when DOM is loaded
	H('span.classname').removeClass('classname').closest('div').attr('data-value', 'true');
	await H.delay(1000); // Some helpers are shared between server/browser

	// Yes, you can use the same api for http requests whether it is client-side or server-side
	console.log((await H.httpGet('http://api.icndb.com/jokes/random', {}, undefined, undefined, 'form', 'json')).value.joke);

});
```


{{>main}}

# upperH
upperH is a collection of helper functions to make starting a nodeJS project faster.

# Get started

## Install
```
npm install upperh --save
```

## How to use
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

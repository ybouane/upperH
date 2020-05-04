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


## Members

<dl>
<dt><a href="#HBrowser">HBrowser</a> ⇒ <code>this</code></dt>
<dd><p>H helper functions available only for Browsers. Chainable and is similar to jQuery&#39;s $ constructor.</p>
</dd>
<dt><a href="#H">H</a></dt>
<dd><p>H helper functions available in both Servers and browsers</p>
</dd>
<dt><a href="#HServer">HServer</a></dt>
<dd><p>H helper functions available only for Servers</p>
</dd>
</dl>

<a name="HBrowser"></a>

## HBrowser ⇒ <code>this</code>
H helper functions available only for Browsers. Chainable and is similar to jQuery's $ constructor.

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| parameter | <code>String</code> \| <code>function</code> | DOM selector, HTML code that will be used to create new elements, Function to run when document is ready. Similar to $(function(){ }) or $(document).ready(function(){ }) |


* [HBrowser](#HBrowser) ⇒ <code>this</code>
    * [.find(selector)](#HBrowser+find) ⇒ <code>this</code>
    * [.closest(selector)](#HBrowser+closest) ⇒ <code>this</code>
    * [.parents(selector)](#HBrowser+parents) ⇒ <code>this</code>
    * [.parent(selector)](#HBrowser+parent) ⇒ <code>this</code>
    * [.children(selector)](#HBrowser+children) ⇒ <code>this</code>
    * [.siblings(selector)](#HBrowser+siblings) ⇒ <code>this</code>
    * [.first()](#HBrowser+first) ⇒ <code>this</code>
    * [.last()](#HBrowser+last) ⇒ <code>this</code>
    * [.attr(name)](#HBrowser+attr) ⇒ <code>String</code>
    * [.attr(name, value)](#HBrowser+attr) ⇒ <code>this</code>
    * [.removeAttr(name)](#HBrowser+removeAttr) ⇒ <code>this</code>
    * [.show()](#HBrowser+show) ⇒ <code>this</code>
    * [.hide()](#HBrowser+hide) ⇒ <code>this</code>
    * [.prop(key)](#HBrowser+prop) ⇒ <code>String</code>
    * [.prop(key, value)](#HBrowser+prop) ⇒ <code>this</code>
    * [.css(name)](#HBrowser+css) ⇒ <code>String</code>
    * [.css(name, value)](#HBrowser+css) ⇒ <code>this</code>
    * [.css(properties)](#HBrowser+css) ⇒ <code>this</code>
    * [.append(content)](#HBrowser+append) ⇒ <code>this</code>
    * [.appendTo(target)](#HBrowser+appendTo) ⇒ <code>this</code>
    * [.prepend(content)](#HBrowser+prepend) ⇒ <code>this</code>
    * [.prependTo(target)](#HBrowser+prependTo) ⇒ <code>this</code>
    * [.empty()](#HBrowser+empty) ⇒ <code>this</code>
    * [.remove()](#HBrowser+remove) ⇒ <code>void</code>
    * [.eq(index)](#HBrowser+eq) ⇒ <code>this</code>
    * [.index()](#HBrowser+index) ⇒ <code>Number</code>
    * [.html()](#HBrowser+html) ⇒ <code>String</code>
    * [.html(content)](#HBrowser+html) ⇒ <code>this</code>
    * [.text()](#HBrowser+text) ⇒ <code>String</code>
    * [.text(content)](#HBrowser+text) ⇒ <code>this</code>
    * [.val()](#HBrowser+val) ⇒ <code>String</code>
    * [.val(value)](#HBrowser+val) ⇒ <code>this</code>
    * [.each(function)](#HBrowser+each) ⇒ <code>this</code>
    * [.get()](#HBrowser+get) ⇒ <code>Node</code>
    * [.get(index)](#HBrowser+get) ⇒ <code>Node</code>
    * [.addClass(className)](#HBrowser+addClass) ⇒ <code>this</code>
    * [.removeClass(className)](#HBrowser+removeClass) ⇒ <code>this</code>
    * [.toggleClass(className)](#HBrowser+toggleClass) ⇒ <code>this</code>
    * [.hasClass(className)](#HBrowser+hasClass) ⇒ <code>Boolean</code>
    * [.filter(selector)](#HBrowser+filter) ⇒ <code>this</code>
    * [.filter(fn)](#HBrowser+filter) ⇒ <code>this</code>
    * [.is(selector)](#HBrowser+is) ⇒ <code>Boolean</code>
    * [.offset()](#HBrowser+offset) ⇒ <code>Object</code>
    * [.on(events, selector, callback, options)](#HBrowser+on) ⇒ <code>this</code>
    * [.one(events, selector, callback, options)](#HBrowser+one) ⇒ <code>this</code>
    * [.off(events, callback)](#HBrowser+off) ⇒ <code>this</code>
    * [.trigger(event, extraParams)](#HBrowser+trigger) ⇒ <code>this</code>
    * [.triggerHandler(event, extraParams)](#HBrowser+triggerHandler) ⇒ <code>Mixed</code>

<a name="HBrowser+find"></a>

### h().find(selector) ⇒ <code>this</code>
Get the descendants of each element in the current set of matched elements, filtered by a selector.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>String</code> | DOM selector |

<a name="HBrowser+closest"></a>

### h().closest(selector) ⇒ <code>this</code>
For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>String</code> | DOM selector |

<a name="HBrowser+parents"></a>

### h().parents(selector) ⇒ <code>this</code>
Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>String</code> | DOM selector |

<a name="HBrowser+parent"></a>

### h().parent(selector) ⇒ <code>this</code>
Get the parent of each element in the current set of matched elements, optionally filtered by a selector.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>String</code> | DOM selector |

<a name="HBrowser+children"></a>

### h().children(selector) ⇒ <code>this</code>
Get the children of each element in the set of matched elements, optionally filtered by a selector.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>String</code> | DOM selector |

<a name="HBrowser+siblings"></a>

### h().siblings(selector) ⇒ <code>this</code>
Get the siblings of each element in the set of matched elements, optionally filtered by a selector.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>String</code> | DOM selector |

<a name="HBrowser+first"></a>

### h().first() ⇒ <code>this</code>
Reduce the set of matched elements to the first in the set.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+last"></a>

### h().last() ⇒ <code>this</code>
Reduce the set of matched elements to the last in the set.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+attr"></a>

### h().attr(name) ⇒ <code>String</code>
Get the value of an attribute for the first element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Attribute name |

<a name="HBrowser+attr"></a>

### h().attr(name, value) ⇒ <code>this</code>
Set an attribute for the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Attribute name |
| value | <code>String</code> | Attribute value |

<a name="HBrowser+removeAttr"></a>

### h().removeAttr(name) ⇒ <code>this</code>
Remove an attribute from each element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Attribute name |

<a name="HBrowser+show"></a>

### h().show() ⇒ <code>this</code>
Display the matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+hide"></a>

### h().hide() ⇒ <code>this</code>
Hide the matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+prop"></a>

### h().prop(key) ⇒ <code>String</code>
Get the value of a property for the first element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Property name |

<a name="HBrowser+prop"></a>

### h().prop(key, value) ⇒ <code>this</code>
Set a property for the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Property name |
| value | <code>String</code> | Property value |

<a name="HBrowser+css"></a>

### h().css(name) ⇒ <code>String</code>
Get the computed style properties for the first element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Property name |

<a name="HBrowser+css"></a>

### h().css(name, value) ⇒ <code>this</code>
Set a CSS property for the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Property name |
| value | <code>String</code> | Property value |

<a name="HBrowser+css"></a>

### h().css(properties) ⇒ <code>this</code>
Set one or more CSS properties for the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| properties | <code>Object</code> | Key-value pair of properties to set. |

<a name="HBrowser+append"></a>

### h().append(content) ⇒ <code>this</code>
Insert content, specified by the parameter, to the end of each element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>Mixed</code> | Content to insert. (either a selector, HTML content or a DOM Node) |

<a name="HBrowser+appendTo"></a>

### h().appendTo(target) ⇒ <code>this</code>
Insert every element in the set of matched elements to the end of the target(s).

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Mixed</code> | Target of the content. (either a selector, HTML content or a DOM Node) |

<a name="HBrowser+prepend"></a>

### h().prepend(content) ⇒ <code>this</code>
Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>Mixed</code> | Content to insert. (either a selector, HTML content or a DOM Node) |

<a name="HBrowser+prependTo"></a>

### h().prependTo(target) ⇒ <code>this</code>
Insert every element in the set of matched elements to the beginning of the target(s).

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Mixed</code> | Target of the content. (either a selector, HTML content or a DOM Node) |

<a name="HBrowser+empty"></a>

### h().empty() ⇒ <code>this</code>
Remove all child nodes of the set of matched elements from the DOM.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+remove"></a>

### h().remove() ⇒ <code>void</code>
Remove the set of matched elements from the DOM.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+eq"></a>

### h().eq(index) ⇒ <code>this</code>
Reduce the set of matched elements to the one at the specified index.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | Index of the element |

<a name="HBrowser+index"></a>

### h().index() ⇒ <code>Number</code>
Search for a given element from among the matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+html"></a>

### h().html() ⇒ <code>String</code>
Get the HTML contents of the first element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+html"></a>

### h().html(content) ⇒ <code>this</code>
Set the HTML contents of each element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>String</code> | HTML content |

<a name="HBrowser+text"></a>

### h().text() ⇒ <code>String</code>
Get the combined text contents of each element in the set of matched elements, including their descendants.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+text"></a>

### h().text(content) ⇒ <code>this</code>
Set the content of each element in the set of matched elements to the specified text.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| content | <code>String</code> | Text content |

<a name="HBrowser+val"></a>

### h().val() ⇒ <code>String</code>
Get the current value of the first element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+val"></a>

### h().val(value) ⇒ <code>this</code>
Set the value of each element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> | Value |

<a name="HBrowser+each"></a>

### h().each(function) ⇒ <code>this</code>
Iterate over a jQuery object, executing a function for each matched element.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| function | <code>function</code> | Function to execute |

<a name="HBrowser+get"></a>

### h().get() ⇒ <code>Node</code>
Retrieve the elements matched as a vanilla Array.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
<a name="HBrowser+get"></a>

### h().get(index) ⇒ <code>Node</code>
Retrieve one of the elements matched.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>Number</code> | Index of the element to return |

<a name="HBrowser+addClass"></a>

### h().addClass(className) ⇒ <code>this</code>
Adds the specified class(es) to each element in the set of matched elements

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>String</code> | Class name |

<a name="HBrowser+removeClass"></a>

### h().removeClass(className) ⇒ <code>this</code>
Remove a single class, multiple classes, or all classes from each element in the set of matched elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>String</code> | Class name |

<a name="HBrowser+toggleClass"></a>

### h().toggleClass(className) ⇒ <code>this</code>
Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>String</code> | Class name |

<a name="HBrowser+hasClass"></a>

### h().hasClass(className) ⇒ <code>Boolean</code>
Determine whether any of the matched elements are assigned the given class.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| className | <code>String</code> | Class name |

<a name="HBrowser+filter"></a>

### h().filter(selector) ⇒ <code>this</code>
Reduce the set of matched elements to those that match the selector.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>String</code> | DOM Selector |

<a name="HBrowser+filter"></a>

### h().filter(fn) ⇒ <code>this</code>
Reduce the set of matched elements to those that match the function's test.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function used as a test for each elkement in the set. |

<a name="HBrowser+is"></a>

### h().is(selector) ⇒ <code>Boolean</code>
Check the current matched set of elements against a selector and return true if at least one of these elements matches the given arguments.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>String</code> | DOM Selector |

<a name="HBrowser+offset"></a>

### h().offset() ⇒ <code>Object</code>
Get the current coordinates of the first element in the set of matched elements, relative to the document.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  
**Returns**: <code>Object</code> - \{top, left\}  
<a name="HBrowser+on"></a>

### h().on(events, selector, callback, options) ⇒ <code>this</code>
Attach an event handler function for one or more events to the selected elements.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| events | <code>String</code> | One or more space-separated event types and optional namespaces. |
| selector | <code>String</code> | A selector string to filter the descendants of the selected elements that trigger the event. |
| callback | <code>function</code> | Event Handler |
| options | <code>Object</code> | Additional options for .addEventListener |

<a name="HBrowser+one"></a>

### h().one(events, selector, callback, options) ⇒ <code>this</code>
Attach a handler to an event for the elements. The handler is executed at most once per element per event type.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| events | <code>String</code> | One or more space-separated event types and optional namespaces. |
| selector | <code>String</code> | A selector string to filter the descendants of the selected elements that trigger the event. |
| callback | <code>function</code> | Event Handler |
| options | <code>Object</code> | Additional options for .addEventListener |

<a name="HBrowser+off"></a>

### h().off(events, callback) ⇒ <code>this</code>
Remove an event handler.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| events | <code>String</code> | One or more space-separated event types and optional namespaces. |
| callback | <code>function</code> | Event Handler |

<a name="HBrowser+trigger"></a>

### h().trigger(event, extraParams) ⇒ <code>this</code>
Execute all handlers and behaviors attached to the matched elements for the given event type.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Event types and optional namespaces. |
| extraParams | <code>Array.&lt;Mixed&gt;</code> | Additional parameters to pass along to the event handler. |

<a name="HBrowser+triggerHandler"></a>

### h().triggerHandler(event, extraParams) ⇒ <code>Mixed</code>
Execute all handlers attached to an element for an event.

**Kind**: instance method of [<code>HBrowser</code>](#HBrowser)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>String</code> | Event types and optional namespaces. |
| extraParams | <code>Array.&lt;Mixed&gt;</code> | Additional parameters to pass along to the event handler. |

<a name="H"></a>

## H
H helper functions available in both Servers and browsers

**Kind**: global variable  

* [H](#H)
    * [.isArray](#H.isArray) ⇒ <code>Boolean</code>
    * [.regexp](#H.regexp)
    * [.Error](#H.Error)
    * [.isObject(variable)](#H.isObject) ⇒ <code>Boolean</code>
    * [.delay(time)](#H.delay) ⇒ <code>Promise</code>
    * [.timestampMs()](#H.timestampMs) ⇒ <code>Number</code>
    * [.timestamp()](#H.timestamp) ⇒ <code>Number</code>
    * [.relativeTime(timestamp)](#H.relativeTime) ⇒ <code>String</code>
    * [.handlize(str)](#H.handlize) ⇒ <code>String</code>
    * [.regexpEscape()](#H.regexpEscape)
    * [.hasOwnProp(obj, key)](#H.hasOwnProp) ⇒ <code>Bool</code>
    * [.getVariable(obj, path)](#H.getVariable) ⇒ <code>Mixed</code>
    * [.setVariable(obj, path, value)](#H.setVariable)
    * [.escape(str)](#H.escape) ⇒ <code>String</code>
    * [.httpRequest(method, url, payload, headers, extras, [inFormat], [outFormat])](#H.httpRequest) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.httpGet(url, payload, headers, extras, [inFormat], [outFormat])](#H.httpGet) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.httpPost(url, payload, headers, extras, [inFormat], [outFormat])](#H.httpPost) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.httpPut(url, payload, headers, extras, [inFormat], [outFormat])](#H.httpPut) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.httpDelete(url, payload, headers, extras, [inFormat], [outFormat])](#H.httpDelete) ⇒ <code>Promise.&lt;String&gt;</code>

<a name="H.isArray"></a>

### H.isArray ⇒ <code>Boolean</code>
Checks if variable is an array (equivalent to Array.isArray)

**Kind**: static property of [<code>H</code>](#H)  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>Mixed</code> | Variable to check |

<a name="H.regexp"></a>

### H.regexp
Helper regular expressions (RegExp)handle : Valid handle (lowercase letters, numbers, underscores and dashes).email : Valid email address

**Kind**: static property of [<code>H</code>](#H)  
<a name="H.Error"></a>

### H.Error
Custom Error constructor

**Kind**: static property of [<code>H</code>](#H)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | Error message |
| code | <code>Number</code> | Error code. |

<a name="H.isObject"></a>

### H.isObject(variable) ⇒ <code>Boolean</code>
Checks if variable is an object and not an array

**Kind**: static method of [<code>H</code>](#H)  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>Mixed</code> | Variable to check |

<a name="H.delay"></a>

### H.delay(time) ⇒ <code>Promise</code>
Wait for a number of miliseconds

**Kind**: static method of [<code>H</code>](#H)  

| Param | Type | Description |
| --- | --- | --- |
| time | <code>Number</code> | Time in miliseconds |

<a name="H.timestampMs"></a>

### H.timestampMs() ⇒ <code>Number</code>
Returns current timestamp in miliseconds

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>Number</code> - timestamp in miliseconds  
<a name="H.timestamp"></a>

### H.timestamp() ⇒ <code>Number</code>
Returns current timestamp in seconds

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>Number</code> - timestamp in seconds  
<a name="H.relativeTime"></a>

### H.relativeTime(timestamp) ⇒ <code>String</code>
Converts a timestamp into relative time. E.g. about 2 hours ago; less than a minute; in about 5 minutes

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>String</code> - relative representation of timestamp  

| Param | Type | Description |
| --- | --- | --- |
| timestamp | <code>Number</code> \| <code>Date</code> | Time |

<a name="H.handlize"></a>

### H.handlize(str) ⇒ <code>String</code>
Converts a string into a handlized format (uppercase letters, numbers and dashes)

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>String</code> - Handle  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | String to handlize |

<a name="H.regexpEscape"></a>

### H.regexpEscape()
Escapes a regular expression string (RegExp)s : String to escape

**Kind**: static method of [<code>H</code>](#H)  
<a name="H.hasOwnProp"></a>

### H.hasOwnProp(obj, key) ⇒ <code>Bool</code>
Determines if an object has a property. (uses Object.prototype for security)

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>Bool</code> - True if obj has the key property  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | Object to check |
| key | <code>String</code> | Property to check |

<a name="H.getVariable"></a>

### H.getVariable(obj, path) ⇒ <code>Mixed</code>
Goes through an object and returns value of a specific path (using dot notation)

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>Mixed</code> - Value of the path element  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | Input object |
| path | <code>String</code> | Path to traverse (dot notation). e.g. parent.children.property |

<a name="H.setVariable"></a>

### H.setVariable(obj, path, value)
Goes through an object and sets the value of a specific path (using dot notation)

**Kind**: static method of [<code>H</code>](#H)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | Input object |
| path | <code>String</code> | Path to traverse (dot notation). e.g. parent.children.property |
| value | <code>Mixed</code> | New value to inject |

<a name="H.escape"></a>

### H.escape(str) ⇒ <code>String</code>
Escapes a string for HTML injection

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>String</code> - Cleaned output  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | Input string |

<a name="H.httpRequest"></a>

### H.httpRequest(method, url, payload, headers, extras, [inFormat], [outFormat]) ⇒ <code>Promise.&lt;String&gt;</code>
Requests an HTTP endpoint

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>Promise.&lt;String&gt;</code> - Response body  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| method | <code>String</code> |  | Method to use (GET|POST|PUT|DELETE|HEAD) |
| url | <code>String</code> |  | HTTP endpoint |
| payload | <code>Object</code> |  | Payload to inject (will be converted to query string in case of GET request otherwise, the payload is sent as a JSON body) |
| headers | <code>Object</code> |  | Headers to inject |
| extras | <code>Object</code> |  | extra options for the request (same as fetch API options) |
| [inFormat] | <code>String</code> | <code>&quot;json&quot;</code> | Format of the input request (json|form). |
| [outFormat] | <code>String</code> | <code>&quot;json&quot;</code> | Format of the output response (json|text|buffer|stream). |

<a name="H.httpGet"></a>

### H.httpGet(url, payload, headers, extras, [inFormat], [outFormat]) ⇒ <code>Promise.&lt;String&gt;</code>
Requests a GET HTTP endpoint

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>Promise.&lt;String&gt;</code> - Response body  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | HTTP endpoint |
| payload | <code>Object</code> |  | Payload to inject will be converted to query string |
| headers | <code>Object</code> |  | Headers to inject |
| extras | <code>Object</code> |  | extra options for request (same as fetch API options) |
| [inFormat] | <code>String</code> | <code>&quot;json&quot;</code> | Format of the input request (json|form). |
| [outFormat] | <code>String</code> | <code>&quot;json&quot;</code> | Format of the output response (json|text|buffer|stream). |

<a name="H.httpPost"></a>

### H.httpPost(url, payload, headers, extras, [inFormat], [outFormat]) ⇒ <code>Promise.&lt;String&gt;</code>
Requests a POST HTTP endpoint

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>Promise.&lt;String&gt;</code> - Response body  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | HTTP endpoint |
| payload | <code>Object</code> |  | Payload to inject |
| headers | <code>Object</code> |  | Headers to inject |
| extras | <code>Object</code> |  | extra options for request (same as fetch API options) |
| [inFormat] | <code>String</code> | <code>&quot;json&quot;</code> | Format of the input request (json|form). |
| [outFormat] | <code>String</code> | <code>&quot;json&quot;</code> | Format of the output response (json|text|buffer|stream). |

<a name="H.httpPut"></a>

### H.httpPut(url, payload, headers, extras, [inFormat], [outFormat]) ⇒ <code>Promise.&lt;String&gt;</code>
Requests a PUT HTTP endpoint

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>Promise.&lt;String&gt;</code> - Response body  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | HTTP endpoint |
| payload | <code>Object</code> |  | Payload to inject |
| headers | <code>Object</code> |  | Headers to inject |
| extras | <code>Object</code> |  | extra options for request (same as fetch API options) |
| [inFormat] | <code>String</code> | <code>&quot;json&quot;</code> | Format of the input request (json|form). |
| [outFormat] | <code>String</code> | <code>&quot;json&quot;</code> | Format of the output response (json|text|buffer|stream). |

<a name="H.httpDelete"></a>

### H.httpDelete(url, payload, headers, extras, [inFormat], [outFormat]) ⇒ <code>Promise.&lt;String&gt;</code>
Requests a DELETE HTTP endpoint

**Kind**: static method of [<code>H</code>](#H)  
**Returns**: <code>Promise.&lt;String&gt;</code> - Response body  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>String</code> |  | HTTP endpoint |
| payload | <code>Object</code> |  | Payload to inject |
| headers | <code>Object</code> |  | Headers to inject |
| extras | <code>Object</code> |  | extra options for request (same as fetch API options) |
| [inFormat] | <code>String</code> | <code>&quot;json&quot;</code> | Format of the input request (json|form). |
| [outFormat] | <code>String</code> | <code>&quot;json&quot;</code> | Format of the output response (json|text|buffer|stream). |

<a name="HServer"></a>

## HServer
H helper functions available only for Servers

**Kind**: global variable  

* [HServer](#HServer)
    * [.readFileBuff](#HServer.readFileBuff) ⇒ <code>Promise.&lt;Buffer&gt;</code>
    * [.readFile](#HServer.readFile) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.readDir](#HServer.readDir) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.mkdir](#HServer.mkdir) ⇒ <code>Promise</code>
    * [.writeFile](#HServer.writeFile) ⇒ <code>Promise</code>
    * [.readFileSync](#HServer.readFileSync) ⇒ <code>String</code>
    * [.writeFileSync](#HServer.writeFileSync)
    * [.exec](#HServer.exec) ⇒ <code>Promise.&lt;stdout, stderr&gt;</code>
    * [.uniqueToken](#HServer.uniqueToken) ⇒ <code>String</code>
    * [.md](#HServer.md) ⇒ <code>String</code>
    * [.sha](#HServer.sha) ⇒ <code>String</code>
    * [.sha](#HServer.sha) ⇒ <code>String</code>
    * [.encrypt](#HServer.encrypt) ⇒ <code>String</code> \| <code>Buffer</code>
    * [.decrypt](#HServer.decrypt) ⇒ <code>String</code> \| <code>Buffer</code>
    * [.render](#HServer.render) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.renderFile](#HServer.renderFile) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.input](#HServer.input) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.waitForKey](#HServer.waitForKey) ⇒ <code>String</code>
    * [.onKeypress](#HServer.onKeypress)
    * [.httpServer](#HServer.httpServer)

<a name="HServer.readFileBuff"></a>

### H.readFileBuff ⇒ <code>Promise.&lt;Buffer&gt;</code>
Reads a local file and returns a buffer

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - Content of the file as a buffer  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | File path |

<a name="HServer.readFile"></a>

### H.readFile ⇒ <code>Promise.&lt;String&gt;</code>
Reads a local file and returns it content as a string

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>Promise.&lt;String&gt;</code> - Content of the file's content as a string  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | File path |

<a name="HServer.readDir"></a>

### H.readDir ⇒ <code>Promise.&lt;Array&gt;</code>
Returns the list of files of a directory

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - Directory list  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | Path of the directory |

<a name="HServer.mkdir"></a>

### H.mkdir ⇒ <code>Promise</code>
Creates a directory

**Kind**: static property of [<code>HServer</code>](#HServer)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | Path of the directory |

<a name="HServer.writeFile"></a>

### H.writeFile ⇒ <code>Promise</code>
Writes a string into a file

**Kind**: static property of [<code>HServer</code>](#HServer)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | File path |
| content | <code>String</code> | New file content |

<a name="HServer.readFileSync"></a>

### H.readFileSync ⇒ <code>String</code>
Reads a local file (synchronously) and returns it content as a string

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>String</code> - Content of the file's content as a string  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | File path |

<a name="HServer.writeFileSync"></a>

### H.writeFileSync
Writes a string into a file (synchronously)

**Kind**: static property of [<code>HServer</code>](#HServer)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | File path |
| content | <code>String</code> | New file content |

<a name="HServer.exec"></a>

### H.exec ⇒ <code>Promise.&lt;stdout, stderr&gt;</code>
Executes a child process

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>Promise.&lt;stdout, stderr&gt;</code> - Returns command output (stdout & stderr)  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>String</code> | Command to execute |
| [options] | <code>Object</code> | Options (see child_process.exec) |

<a name="HServer.uniqueToken"></a>

### H.uniqueToken ⇒ <code>String</code>
Returns a random *unique* token

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>String</code> - Hexadecimal representation of token  
<a name="HServer.md"></a>

### H.md ⇒ <code>String</code>
Returns MD5 hash

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>String</code> - MD5 hash of input (in HEX format)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> \| <code>Buffer</code> | Input to get hash of |

<a name="HServer.sha"></a>

### H.sha ⇒ <code>String</code>
Returns SHA1 hash

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>String</code> - SHA1 hash of input (in HEX format)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> \| <code>Buffer</code> | Input to get hash of |

<a name="HServer.sha"></a>

### H.sha ⇒ <code>String</code>
Returns SHA256 hash

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>String</code> - SHA256 hash of input (in HEX format)  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> \| <code>Buffer</code> | Input to get hash of |

<a name="HServer.encrypt"></a>

### H.encrypt ⇒ <code>String</code> \| <code>Buffer</code>
Encrypts an input string with aes-256-cbc encryption algorithm

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>String</code> \| <code>Buffer</code> - Encrypted data  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>String</code> \| <code>Buffer</code> |  | Input data to encrypt |
| key | <code>String</code> |  | Encryption key in HEX format. Must be a 32byte key for a 256bit algorithm. |
| iv | <code>String</code> |  | IV to use for the encryption in HEX format. For AES, length must be 16 |
| [algo] | <code>String</code> | <code>&quot;aes-256-cbc&quot;</code> | Encryption algorithm |
| [format] | <code>String</code> | <code>&quot;hex&quot;</code> | Format of output |

**Example**  
```js
const key = crypto.scryptSync('Password here', 'salt', 32).toString('hex'); // 32 = 256/8const iv = Buffer.from('d65a8b0dcbde0b76cc746faaf0b0beaa', 'hex'); // For AES, length is 16var encryptedData = H.encrypt('My secret data', key, iv);
```
<a name="HServer.decrypt"></a>

### H.decrypt ⇒ <code>String</code> \| <code>Buffer</code>
Decrypts an input string with aes-256-cbc encryption algorithm

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>String</code> \| <code>Buffer</code> - Encrypted data  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>String</code> \| <code>Buffer</code> |  | Input data to decrypt |
| key | <code>String</code> |  | Decryption key in HEX format. Must be a 32byte key for a 256bit algorithm. |
| iv | <code>String</code> |  | IV to use for the decryption in HEX format. For AES, length must be 16 |
| [algo] | <code>String</code> | <code>&quot;aes-256-cbc&quot;</code> | Decryption algorithm |
| [format] | <code>String</code> | <code>&quot;hex&quot;</code> | Format of output |

**Example**  
```js
const key = crypto.scryptSync('Password here', 'salt', 32).toString('hex'); // 32 = 256/8const iv = Buffer.from('d65a8b0dcbde0b76cc746faaf0b0beaa', 'hex'); // For AES, length is 16var originalData = H.encrypt(encryptedData, key, iv);
```
<a name="HServer.render"></a>

### H.render ⇒ <code>Promise.&lt;String&gt;</code>
Renders a nunjucks/jinja template string asynchronously

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>Promise.&lt;String&gt;</code> - Rendered template  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | Template string (jinja/nunjucks) |
| data | <code>Object</code> | Data to inject in template |
| filters | <code>Object</code> | Filters functions to allow in template |
| includeCb | <code>function</code> | Callback function that is called whenever the template calls the include instruction. |

<a name="HServer.renderFile"></a>

### H.renderFile ⇒ <code>Promise.&lt;String&gt;</code>
Renders a nunjucks/jinja template file asynchronously

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>Promise.&lt;String&gt;</code> - Rendered template  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | Path of template file to render |
| data | <code>Object</code> | Data to inject in template |
| filters | <code>Object</code> | Filters functions to allow in template |
| includeCb | <code>function</code> | Callback function that is called whenever the template calls the include instruction. |

<a name="HServer.input"></a>

### H.input ⇒ <code>Promise.&lt;String&gt;</code>
Requests input from user in command line interface

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>Promise.&lt;String&gt;</code> - the value the user has entered  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| q | <code>String</code> |  | Question to ask to user during input |
| [muted] | <code>Boolean</code> | <code>false</code> | Whether to mute the user input (for passwords) |

<a name="HServer.waitForKey"></a>

### H.waitForKey ⇒ <code>String</code>
Shortcut for H.input but without the muted parameter set to true

**Kind**: static property of [<code>HServer</code>](#HServer)  
**Returns**: <code>String</code> - the value the user has entered  

| Param | Type | Description |
| --- | --- | --- |
| q | <code>String</code> | Question to ask to user during input |

<a name="HServer.onKeypress"></a>

### H.onKeypress
Listens to keypresses and calls callback when a key is pressed. Exists when Ctrl+C is typed

**Kind**: static property of [<code>HServer</code>](#HServer)  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | Callback to function that will listen to key presses |

<a name="HServer.httpServer"></a>

### H.httpServer
Starts an HTTP server and calls specific handlers depending on request url

**Kind**: static property of [<code>HServer</code>](#HServer)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [post] | <code>Number</code> | <code>80</code> | Post to listen to |
| handlers | <code>function</code> \| <code>Object</code> |  | If function, it will run function and use returned Object to select handler. If Object, it will use it directly to select the handler. The handler is selected if it matches the request url. If the handler's key starts with ^, it will be considered as a REGEX. |
| options | <code>Object</code> |  | Extra options. defaultHandler, onError, beforeHandler, pathFlags, afterHandler, autoEnd, maxPostRequestSize, |


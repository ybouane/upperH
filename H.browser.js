'use strict';

/**
* H helper functions available only for Browsers. Chainable and is similar to jQuery's $ constructor.
* @typicalname H()
* @name HBrowser
* @param {String|Function} parameter DOM selector, HTML code that will be used to create new elements, Function to run when document is ready. Similar to $(function(){ }) or $(document).ready(function(){ })
* @returns {HObject}
*/
const H = (s) => {
	if(!s)
		s = [];
	if(typeof s == 'string') {
		s = s.trim();
		if(s[0]=='<') {
			if (/^<(\w+)\s*\/?>(?:<\/\1>|)$/.test(s))
				s = [document.createElement(RegExp.$1)];
			else {
				var container = document.createElement('div');
				container.innerHTML = s;
				s = HObject.from(container.children);
			}
		} else
			s = document.querySelectorAll(s);
	} else if(typeof s == 'function') {
		if (document.readyState === 'loading')
			document.addEventListener('DOMContentLoaded', s);
		else
			s();
		return;
	}
	if(s instanceof NodeList)
		s = HObject.from(s);
	if(!H.isArray(s))
		s = new HObject(s);
	if(!(s instanceof HObject)) // In case it is just a regular array
		s = HObject.from(s);
	return s.filter(e=>e instanceof Node);
};

require('./H.common.js')(H);

/**
* Collection of DOM Nodes, extends Array
* @typicalname H()
*/
class HObject extends Array {
	/**
	* Get the descendants of each element in the current set of matched elements, filtered by a selector.
	* @param {String} selector DOM selector
	* @returns {HObject}
	*/
	find(sel) {
		return this.map(e=>HObject.from(e.querySelectorAll(sel))).flat();
	}
	/**
	* For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
	* @param {String} selector DOM selector
	* @returns {HObject}
	*/
	closest(sel) {
		var nodes = new HObject();
		var closest = (ele) => {
			let parent;
			while (ele) {
				parent = ele.parentElement;
				if(parent && parent.matches(sel)) {
					return parent;
				}
				ele = parent;
			}
			return;
		}
		this.forEach((ele) => {
			var c = closest(ele);
			if(c)
				nodes.push(c);
		});
		return nodes;
	}
	/**
	* Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
	* @param {String} selector DOM selector
	* @returns {HObject}
	*/
	parents(sel) {
		var parents = new HObject();
		for(let el of this) {
			while(el) {
				el = el.parentElement;
				if(el && (!sel || el.matches(sel)))
					parents.push(el);
			}
		}
		return parents;
	}
	/**
	* Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
	* @param {String} selector DOM selector
	* @returns {HObject}
	*/
	parent(sel) {
		return this.map(ele=>ele.parentElement).filter(e=>!sel || e.is(sel));
	}
	/**
	* Get the children of each element in the set of matched elements, optionally filtered by a selector.
	* @param {String} selector DOM selector
	* @returns {HObject}
	*/
	children(sel) {
		return this.map(e=>Array.from(e.children).filter(e=>!sel || e.matches(sel))).flat();
	}
	/**
	* Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
	* @param {String} selector DOM selector
	* @returns {HObject}
	*/
	siblings(sel) {
		return this.map(e=>{
			return Array.from(e.parentNode.children).filter(ele=>ele!=e && (!sel || ele.matches(sel)));
		}).flat();
	}
	/**
	* Reduce the set of matched elements to the first in the set.
	* @returns {HObject}
	*/
	first() {
		return new HObject(this[0]);
	}
	/**
	* Reduce the set of matched elements to the last in the set.
	* @returns {HObject}
	*/
	last() {
		return new HObject(this[this.length-1]);
	}
	/**
	* Get the immediately preceding sibling of each element in the set of matched elements. If a selector is provided, it retrieves the previous sibling only if it matches that selector.
	* @param {String} selector DOM selector
	* @returns {HObject}
	*/
	prev(sel) {
		return this.map(e=>e.previousElementSibling).filter(e=>e && (!sel || e.matches(sel)));
	}
	/**
	* Get the immediately following sibling of each element in the set of matched elements. If a selector is provided, it retrieves the next sibling only if it matches that selector.
	* @param {String} selector DOM selector
	* @returns {HObject}
	*/
	next(sel) {
		return this.map(e=>e.nextElementSibling).filter(e=>e && (!sel || e.matches(sel)));
	}
	/**
	* Get all preceding siblings of each element in the set of matched elements, optionally filtered by a selector.
	* @param {String} selector DOM selector
	* @returns {HObject}
	*/
	prevAll(sel) {
		var elements = new HObject();
		for(let el of this) {
			while(el) {
				el = el.previousElementSibling;
				if(el && (!sel || el.matches(sel)))
					elements.push(el);
			}
		}
		return elements;
	}
	/**
	* Get all following siblings of each element in the set of matched elements, optionally filtered by a selector.
	* @param {String} selector DOM selector
	* @returns {HObject}
	*/
	nextAll(sel) {
		var elements = new HObject();
		for(let el of this) {
			while(el) {
				el = el.nextElementSibling;
				if(el && (!sel || el.matches(sel)))
					elements.push(el);
			}
		}
		return elements;
	}

	/**
	* Get the value of an attribute for the first element in the set of matched elements.
	* @param {String} name Attribute name
	* @returns {String}
	*//**
	* Set an attribute for the set of matched elements.
	* @param {String} name Attribute name
	* @param {String} value Attribute value
	* @returns {HObject}
	*/
	attr(attr, val) {
		if(typeof val!='undefined') {
			this.forEach(e=>e.setAttribute(attr, val));
			return this;
		} else
			return this[0] && this[0].getAttribute(attr);
	}
	/**
	* Remove an attribute from each element in the set of matched elements.
	* @param {String} name Attribute name
	* @returns {HObject}
	*/
	removeAttr(attr) {
		this.forEach(e=>e.removeAttribute(attr));
		return this;
	}
	/**
	* Display the matched elements.
	* @returns {HObject}
	*/
	show() {
		return this.css('display', '');
	}
	/**
	* Hide the matched elements.
	* @returns {HObject}
	*/
	hide() {
		return this.css('display', 'none');
	}
	/**
	* Get the value of a property for the first element in the set of matched elements.
	* @param {String} key Property name
	* @returns {String}
	*//**
	* Set a property for the set of matched elements.
	* @param {String} key Property name
	* @param {String} value Property value
	* @returns {HObject}
	*/
	prop(key, val) {
		if(typeof val!='undefined') {
			this.forEach(e=>e[key]=val);
			return this;
		} else
			return this[0] && this[0][key];
	}
	/**
	* Get the computed style properties for the first element in the set of matched elements.
	* @param {String} name Property name
	* @returns {String}
	*//**
	* Set a CSS property for the set of matched elements.
	* @param {String} name Property name
	* @param {String} value Property value
	* @returns {HObject}
	*//**
	* Set one or more CSS properties for the set of matched elements.
	* @param {Object} properties Key-value pair of properties to set.
	* @returns {HObject}
	*/
	css(key, value, important) {
		var props = {};
		if (typeof key == 'string') {
			if (typeof value === 'undefined') {
				let kHyphen = key.indexOf('--')==0?key:(key.replace(/([a-z])([A-Z])/g, function(matches, l1, l2) {// To hyphen-case
					return l1+'-'+l2;
				}).toLowerCase());
				return window.getComputedStyle(this[0]).getPropertyValue(kHyphen);
			}
			props = {
				[key]	: value
			};
		} else if (H.isObject(key))
			props = key;
		for(let k in props) {
			let kHyphen = k.indexOf('--')==0?k:(k.replace(/([a-z])([A-Z])/g, function(matches, l1, l2) {// To hyphen-case
				return l1+'-'+l2;
			}).toLowerCase());
			for(let ele of this) {
				ele.style.setProperty(kHyphen, props[k], important?'important':undefined);
			}
		}
		return this;
	}
	/**
	* Insert content, specified by the parameter, to the end of each element in the set of matched elements.
	* @param {Mixed} content Content to insert. (either a selector, HTML content or a DOM Node)
	* @returns {HObject}
	*/
	append(sel) {
		this.forEach(el=>{
			var ch = H(sel);
			for(let child of ch)
				el.appendChild(child);
		});
		return this;
	}
	/**
	* Insert every element in the set of matched elements to the end of the target(s).
	* @param {Mixed} target Target of the content. (either a selector, HTML content or a DOM Node)
	* @returns {HObject}
	*/
	appendTo(sel) {
		H(sel).append(this);
		return this;
	}
	/**
	* Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
	* @param {Mixed} content Content to insert. (either a selector, HTML content or a DOM Node)
	* @returns {HObject}
	*/
	prepend(sel) {
		this.forEach(el=>{
			var ch = H(sel).reverse();
			for(let child of ch)
				el.insertBefore(child, el.firstChild);
		});
		return this;
	}
	/**
	* Insert every element in the set of matched elements to the beginning of the target(s).
	* @param {Mixed} target Target of the content. (either a selector, HTML content or a DOM Node)
	* @returns {HObject}
	*/
	prependTo(sel) {
		H(sel).prepend(this);
		return this;
	}
	/**
	* Insert every element in the set of matched elements before the target.
	* @param {String} target DOM selector
	* @returns {HObject}
	*/
	insertBefore(sel) {
		H(sel).before(this);
		return this;
	}
	/**
	* Insert content, specified by the parameter, before each element in the set of matched elements
	* @param {String} content HTML code or DOM selector
	* @returns {HObject}
	*/
	before(content) {
		this.forEach(e=>{
			var $content = H(content);
			$content.forEach(c=>{
				e.parentNode.insertBefore(c, e);
			});
		});
		return this;
	}
	/**
	* Insert every element in the set of matched elements after the target.
	* @param {String} target DOM selector
	* @returns {HObject}
	*/
	insertAfter(sel) {
		H(sel).after(this);
		return this;
	}
	/**
	* Insert content, specified by the parameter, after each element in the set of matched elements
	* @param {String} content HTML code or DOM selector
	* @returns {HObject}
	*/
	after(content) {
		this.forEach(e=>{
			var $content = H(content).reverse();
			$content.forEach(c=>{
				var bef = e.nextSibling;
				if(bef)
					bef.parentNode.insertBefore(c, bef);
				else
					e.parentNode.appendChild(c);
			});
		});
		return this;
	}
	/**
	* Wrap an HTML structure around each element in the set of matched elements.
	* @param {String} element Wrapping element.
	* @returns {HObject}
	*/
	wrap(element) {
		this.each(function(){
			H(element).eq(0).insertBefore(this).append(this);
		});
		return this;
	}
	/**
	* Wrap an HTML structure around the content of each element in the set of matched elements.
	* @param {String} element Wrapping element.
	* @returns {HObject}
	*/
	wrapInner(element) {
		this.forEach((t)=>{
			var w = H(element).get(0);
			Array.from(t.childNodes).forEach(e=>w.appendChild(e));
			t.appendChild(w);
		});
		return this;
	}
	/**
	* Remove all child nodes of the set of matched elements from the DOM.
	* @returns {HObject}
	*/
	empty() {
		this.forEach(el=>{
			while(el.firstChild)
				el.removeChild(el.firstChild);
		});
		return this;
	}
	/**
	* Remove the set of matched elements from the DOM.
	* @returns {void}
	*/
	remove(sel) {
		this.forEach(el=>{
			el.parentNode.removeChild(el);
		});
		return;
	}
	/**
	* Reduce the set of matched elements to the one at the specified index.
	* @param {Number} index Index of the element
	* @returns {HObject}
	*/
	eq(index) {
		return new HObject(this[index]);
	}
	/**
	* Search for a given element from among the matched elements.
	* @returns {Number}
	*/
	index() {
		if (!this[0])
			return -1;
		var cEle = this[0];
		let index = 0;
		while(cEle.previousElementSibling) {
			index++;
			cEle = cEle.previousElementSibling;
		}
		return index;
	}

	/**
	* Get the HTML contents of the first element in the set of matched elements.
	* @returns {String}
	*//**
	* Set the HTML contents of each element in the set of matched elements.
	* @param {String} content HTML content
	* @returns {HObject}
	*/
	html(val) {
		if(typeof val!='undefined') {
			this.forEach(e=>e.innerHTML=val);
			return this;
		} else
			return this[0] && this[0].innerHTML;
	}
	/**
	* Get the combined text contents of each element in the set of matched elements, including their descendants.
	* @returns {String}
	*//**
	* Set the content of each element in the set of matched elements to the specified text.
	* @param {String} content Text content
	* @returns {HObject}
	*/
	text(val) {
		if(typeof val!='undefined') {
			this.forEach(e=>e.textContent=val);
			return this;
		} else
			return this[0] && this[0].textContent;
	}
	/**
	* Get the current value of the first element in the set of matched elements.
	* @returns {String}
	*//**
	* Set the value of each element in the set of matched elements.
	* @param {String} value Value
	* @returns {HObject}
	*/
	val(val) {
		if(typeof val!='undefined') {
			this.forEach(e=>e.value=val);
			return this;
		} else
			return this[0] && this[0].value;
	}
	/**
	* Iterate over a jQuery object, executing a function for each matched element.
	* @param {Function} function Function to execute
	* @returns {HObject}
	*/
	each(cb) {
		this.forEach((e, i)=>cb.call(H(e), e, i));
		return this;
	}
	/**
	* Retrieve the elements matched as a vanilla Array.
	* @returns {Node}
	*//**
	* Retrieve one of the elements matched.
	* @param {Number} index Index of the element to return
	* @returns {Node}
	*/
	get(index) {
		if(index!=undefined)
			return this[index];
		else
			return Array.from(this);
	}
	/**
	* Adds the specified class(es) to each element in the set of matched elements
	* @param {String} className Class name
	* @returns {HObject}
	*/
	addClass(c) {
		c.trim().split(' ').forEach(c=>{
			this.forEach(e=>e.classList.add(c));
		});
		return this;
	}
	/**
	* Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
	* @param {String} className Class name
	* @returns {HObject}
	*/
	removeClass(c) {
		c.trim().split(' ').forEach(c=>{
			this.forEach(e=>e.classList.remove(c));
		});
		return this;
	}
	/**
	* Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.
	* @param {String} className Class name
	* @returns {HObject}
	*/
	toggleClass(c) {
		c.trim().split(' ').forEach(c=>{
			this.forEach(e=>e.classList.toggle(c));
		});
		return this;
	}
	/**
	* Determine whether any of the matched elements are assigned the given class.
	* @param {String} className Class name
	* @returns {Boolean}
	*/
	hasClass(c) {
		return this.some(e=>e.classList.contains(c));
	}
	/**
	* Reduce the set of matched elements to those that match the selector.
	* @param {String} selector DOM Selector
	* @returns {HObject}
	*//**
	* Reduce the set of matched elements to those that match the function's test.
	* @param {Function} fn Function used as a test for each elkement in the set.
	* @returns {HObject}
	*/
	filter(cb) {
		if(typeof cb == 'string')
			return HObject.from(this.get().filter(e=>e.matches(cb)));
		else
			return HObject.from(this.get().filter((e, i)=>cb.call(new HObject(e), e, i)));
	}
	/**
	* Check the current matched set of elements against a selector and return true if at least one of these elements matches the given arguments.
	* @param {String} selector DOM Selector
	* @returns {Boolean}
	*/
	is(sel) {
		return this.some(e=>e.matches(sel));
	}
	/**
	* Get the current coordinates of the first element in the set of matched elements, relative to the document.
	* @returns {Object} \{top, left\}
	*/
	offset() {
		if(!this[0])
			return undefined;
		var rect = this[0].getBoundingClientRect();
		return {
			top: rect.top + window.scrollY,
			left: rect.left + window.scrollX
		};
	}

	/**
	* Attach an event handler function for one or more events to the selected elements.
	* @param {String} events One or more space-separated event types and optional namespaces.
	* @param {String} selector A selector string to filter the descendants of the selected elements that trigger the event.
	* @param {Function} callback Event Handler
	* @param {Object} options Additional options for .addEventListener
	* @returns {HObject}
	*/
	on(events, sel, cb, opts) {
		if(typeof sel!='string') {
			opts = cb;
			cb = sel;
			sel = undefined;
		}
		if(typeof opts=='boolean') {
			opts = {
				once	: opts,
			};
		}
		opts = opts || {};
		var this_ = this;
		var handler = function(e) {
			var $target = this;
			if(sel) {
				if(e.target.matches(sel)) {
					$target = e.target;
				} else {
					$target = H(e.target).closest(sel);
					if($target.length==0) // Skip if it doesn't have a parent matching sel
						return;
				}
			}
			return cb.call(H($target), e, ...(H.isArray(e.detail)?e.detail:[]));
		};
		events.trim().split(' ').forEach((event) => {
			let parts = event.split('.');
			let eventName = parts.shift() || null;
			let namespace = parts.join('.') || null;
			if(!eventName)
				return;
			this.forEach((ele) => {
				ele.attachedEvents = ele.attachedEvents || [];
				ele.attachedEvents.push({
					eventName,
					namespace,
					handler,
					capture	: opts.capture || false
				});
				ele.addEventListener(eventName, handler, opts);
			});
		});
		return this;
	}
	/**
	* Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
	* @param {String} events One or more space-separated event types and optional namespaces.
	* @param {String} selector A selector string to filter the descendants of the selected elements that trigger the event.
	* @param {Function} callback Event Handler
	* @param {Object} options Additional options for .addEventListener
	* @returns {HObject}
	*/
	one(events, sel, cb, opts) {
		if(typeof sel!='string') {
			cb = cb || {};
			cb.once = true;
		} else {
			opts = opts || {};
			opts.once = true;
		}
		return this.on(events, sel, cb, opts);
	}
	/**
	* Remove an event handler.
	* @param {String} events One or more space-separated event types and optional namespaces.
	* @param {Function} callback Event Handler
	* @returns {HObject}
	*/
	off(events, cb) {
		events.trim().split(' ').forEach((event) => {
			let parts = event.split('.');
			let eventName = parts.shift() || null;
			let namespace = parts.join('.') || null;
			if(!eventName && !namespace)
				return;
			this.forEach((ele) => {
				let toRemove = [];
				ele.attachedEvents = ele.attachedEvents || [];
				ele.attachedEvents.forEach((ev, i) => {
					if(
						(!eventName || eventName==ev.eventName) &&
						(!namespace || namespace==ev.namespace) &&
						(!cb && cb==ev.cb)
					) {
						ele.removeEventListener(ev.eventName, ev.handler, ev.capture);
						toRemove.push(i);
					}
				});
				ele.attachedEvents = ele.attachedEvents.filter((e,i)=>!toRemove.includes(i))
			});
		});
		return this;
	}
	/**
	* Execute all handlers and behaviors attached to the matched elements for the given event type.
	* @param {String} event Event types and optional namespaces.
	* @param {Array<Mixed>} extraParams Additional parameters to pass along to the event handler.
	* @returns {HObject}
	*/
	trigger(event, params) {
		let parts = event.split('.');
		let eventName = parts.shift() || null;
		let namespace = parts.join('.') || null;
		if(!eventName)
			return this;
		var event = new CustomEvent(eventName, {
			detail : params,
			bubbles: true,
			cancelable: true,
		});
		for(let ele of this) {
			if(namespace) {
				ele.attachedEvents = ele.attachedEvents || [];
				ele.attachedEvents.forEach(ev => {
					if(eventName==ev.eventName && namespace==ev.namespace)
						ev.handler.call(ele, event);
				});
			} else
				ele.dispatchEvent(event);
		}
		return this;
	}
	/**
	* Execute all handlers attached to an element for an event.
	* @param {String} event Event types and optional namespaces.
	* @param {Array<Mixed>} extraParams Additional parameters to pass along to the event handler.
	* @returns {Mixed}
	*/
	triggerHandler(event, params) {
		let parts = event.split('.');
		let eventName = parts.shift() || null;
		let namespace = parts.join('.') || null;
		if(!eventName)
			return undefined;
		var event = new CustomEvent(eventName, {
			detail : params
		});
		var out;
		this.forEach(ele => {
			ele.attachedEvents = ele.attachedEvents || [];
			ele.attachedEvents.forEach(ev => {
				if(eventName==ev.eventName && (!namespace || namespace==ev.namespace))
					out = ev.handler.call(ele, event);
			});
		});
		return out;
	}
};
H.HObject = HObject;


H._fetch = window.fetch.bind(window);
module.exports = H;

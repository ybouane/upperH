'use strict';

/**
* H helper functions available only for Browsers. Chainable and is similar to jQuery's $ constructor.
* @typicalname H()
* @name HBrowser
* @param {String|Function} parameter DOM selector, HTML code that will be used to create new elements, Function to run when document is ready. Similar to $(function(){ }) or $(document).ready(function(){ })
* @returns {this}
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
				container.innerHTML = html;
				s = container.childNodes;
			}
		} else
			s = document.querySelectorAll(s);
	} else if(typeof s == 'function') {
		if (document.readyState !== 'loading')
			s();
		else
			document.addEventListener('DOMContentLoaded', s);
		return;
	}
	if(s instanceof NodeList)
		s = Array.from(s);
	if(!H.isArray(s))
		s = [s];
	return addHProps(s);
};

require('./H.common.js')(H);



const addHProps = (arr) => {
	for(let prop in HMembers)
		arr[prop] = HMembers[prop];
}

const HMembers = {
	/**
	* Get the descendants of each element in the current set of matched elements, filtered by a selector.
	* @memberof HBrowser#
	* @param {String} selector DOM selector
	* @returns {this}
	*/
	find : function(sel) {
		return addHProps(this.map(e=>Array.from(e.querySelectorAll(sel))).flat());
	},
	/**
	* For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
	* @memberof HBrowser#
	* @param {String} selector DOM selector
	* @returns {this}
	*/
	closest: function(sel) {
		var nodes = [];
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
		return addHProps(nodes);
	},
	/**
	* Get the ancestors of each element in the current set of matched elements, optionally filtered by a selector.
	* @memberof HBrowser#
	* @param {String} selector DOM selector
	* @returns {this}
	*/
	parents: function(sel) {
		var parents = [];
		for(let el of this) {
			while(el) {
				el = el.parentElement;
				if(el && (!sel || el.matches(sel)))
					parents.push(el);
			}
		}
		return addHProps(parents);
	},
	/**
	* Get the parent of each element in the current set of matched elements, optionally filtered by a selector.
	* @memberof HBrowser#
	* @param {String} selector DOM selector
	* @returns {this}
	*/
	parent: function(sel) {
		return addHProps(this.get().map(ele=>ele.parentElement).filter(e=>!sel || e.matches(sel)));
	},
	/**
	* Get the children of each element in the set of matched elements, optionally filtered by a selector.
	* @memberof HBrowser#
	* @param {String} selector DOM selector
	* @returns {this}
	*/
	children: function(sel) {
		return addHProps(this.map(e=>e.childNodes.filter(e=>!sel || e.matches(sel))).flat());
	},
	/**
	* Get the siblings of each element in the set of matched elements, optionally filtered by a selector.
	* @memberof HBrowser#
	* @param {String} selector DOM selector
	* @returns {this}
	*/
	siblings: function(sel) {
		return addHProps(this.map(e=>{
			return Array.from(e.parentNode.children).filter(ele=>ele!=e && (!sel || ele.matches(sel)));
		}).flat());
	},
	/**
	* Reduce the set of matched elements to the first in the set.
	* @memberof HBrowser#
	* @returns {this}
	*/
	first: function() {
		return addHProps([this[0]]);
	},
	/**
	* Reduce the set of matched elements to the last in the set.
	* @memberof HBrowser#
	* @returns {this}
	*/
	last: function() {
		return addHProps([this[this.length-1]]);
	},

	/**
	* Get the value of an attribute for the first element in the set of matched elements.
	* @memberof HBrowser#
	* @param {String} name Attribute name
	* @returns {String}
	*//**
	* Set an attribute for the set of matched elements.
	* @memberof HBrowser#
	* @param {String} name Attribute name
	* @param {String} value Attribute value
	* @returns {this}
	*/
	attr: function(attr, val) {
		if(typeof val=='string') {
			this.forEach(e=>e.setAttribute(attr, val));
			return this;
		} else
			return this[0] && this[0].getAttribute(attr);
	},

	/**
	* Remove an attribute from each element in the set of matched elements.
	* @memberof HBrowser#
	* @param {String} name Attribute name
	* @returns {this}
	*/
	removeAttr: function(attr) {
		this.forEach(e=>e.removeAttribute(attr));
		return this;
	},
	/**
	* Display the matched elements.
	* @memberof HBrowser#
	* @returns {this}
	*/
	show: function() {
		return this.css('display', '');
	},
	/**
	* Hide the matched elements.
	* @memberof HBrowser#
	* @returns {this}
	*/
	hide: function() {
		return this.css('display', 'none');
	},
	/**
	* Get the value of a property for the first element in the set of matched elements.
	* @memberof HBrowser#
	* @param {String} key Property name
	* @returns {String}
	*//**
	* Set a property for the set of matched elements.
	* @memberof HBrowser#
	* @param {String} key Property name
	* @param {String} value Property value
	* @returns {this}
	*/
	prop: function(key, val) {
		if(typeof val=='string') {
			this.forEach(e=>e[key]=val);
			return this;
		} else
			return this[0] && this[0][key];
	},
	/**
	* Get the computed style properties for the first element in the set of matched elements.
	* @memberof HBrowser#
	* @param {String} name Property name
	* @returns {String}
	*//**
	* Set a CSS property for the set of matched elements.
	* @memberof HBrowser#
	* @param {String} name Property name
	* @param {String} value Property value
	* @returns {this}
	*//**
	* Set one or more CSS properties for the set of matched elements.
	* @memberof HBrowser#
	* @param {Object} properties Key-value pair of properties to set.
	* @returns {this}
	*/
	css: function(key, value, important) {
		var props = {};
		if (typeof key == 'string') {
			if (typeof value === 'undefined')
				return window.getComputedStyle(this[0]).getPropertyValue(key);
			props = {
				[key]	: value
			};
		} else if (H.isObject(key))
			props = key;
		for(let k in props) {
			let kHyphen = k.replace(/([a-z])([A-Z])/g, function(matches, l1, l2) { // To hyphen-case
				return l1+'-'+l2;
			}).toLowerCase();
			let kCamel = k.replace(/\-([a-z])/gi, function(matches, l) { // To hyphen-case
				return l.toUpperCase();
			});
			this.forEach((ele) => {
				try {
					window.getComputedStyle(ele).setProperty(kHyphen, props[k], important?'important':undefined);
				} catch (err){
					ele.style[kCamel] = props[k];
				}
			})
		}
		return this;
	},
	/**
	* Insert content, specified by the parameter, to the end of each element in the set of matched elements.
	* @memberof HBrowser#
	* @param {Mixed} content Content to insert. (either a selector, HTML content or a DOM Node)
	* @returns {this}
	*/
	append: function(sel) {
		this.forEach(el=>{
			var ch = H(sel);
			for(let child of ch)
				el.appendChild(child);
		});
		return this;
	},
	/**
	* Insert every element in the set of matched elements to the end of the target(s).
	* @memberof HBrowser#
	* @param {Mixed} target Target of the content. (either a selector, HTML content or a DOM Node)
	* @returns {this}
	*/
	appendTo: function(sel) {
		H(sel).append(this);
		return this;
	},
	/**
	* Insert content, specified by the parameter, to the beginning of each element in the set of matched elements.
	* @memberof HBrowser#
	* @param {Mixed} content Content to insert. (either a selector, HTML content or a DOM Node)
	* @returns {this}
	*/
	prepend: function(sel) {
		this.forEach(el=>{
			var ch = H(sel).reverse();
			for(let child of ch)
				el.insertBefore(child, el.firstChild);
		});
		return this;
	},
	/**
	* Insert every element in the set of matched elements to the beginning of the target(s).
	* @memberof HBrowser#
	* @param {Mixed} target Target of the content. (either a selector, HTML content or a DOM Node)
	* @returns {this}
	*/
	prependTo: function(sel) {
		H(sel).prepend(this);
		return this;
	},
	/**
	* Remove all child nodes of the set of matched elements from the DOM.
	* @memberof HBrowser#
	* @returns {this}
	*/
	empty: function() {
		this.forEach(el=>{
			while(el.firstChild)
				el.removeChild(el.firstChild);
		});
		return this;
	},
	/**
	* Remove the set of matched elements from the DOM.
	* @memberof HBrowser#
	* @returns {void}
	*/
	remove: function(sel) {
		this.forEach(el=>{
			el.parentNode.removeChild(el);
		});
		return;
	},
	/**
	* Reduce the set of matched elements to the one at the specified index.
	* @memberof HBrowser#
	* @param {Number} index Index of the element
	* @returns {this}
	*/
	eq: function(index) {
		return addHProps([this[index]]);
	},
	/**
	* Search for a given element from among the matched elements.
	* @memberof HBrowser#
	* @returns {Number}
	*/
	index: function() {
		if (!this[0])
			return -1;
		var cEle = this[0];
		let index = 0;
		while(cEle.previousElementSibling) {
			index++;
			cEle = cEle.previousElementSibling;
		}
		return index;
	},

	/**
	* Get the HTML contents of the first element in the set of matched elements.
	* @memberof HBrowser#
	* @returns {String}
	*//**
	* Set the HTML contents of each element in the set of matched elements.
	* @memberof HBrowser#
	* @param {String} content HTML content
	* @returns {this}
	*/
	html: function(val) {
		if(typeof val=='string') {
			this.forEach(e=>e.innerHTML=val);
			return this;
		} else
			return this[0] && this[0].innerHTML;
	},
	/**
	* Get the combined text contents of each element in the set of matched elements, including their descendants.
	* @memberof HBrowser#
	* @returns {String}
	*//**
	* Set the content of each element in the set of matched elements to the specified text.
	* @memberof HBrowser#
	* @param {String} content Text content
	* @returns {this}
	*/
	text: function(val) {
		if(typeof val=='string') {
			this.forEach(e=>e.textContent=val);
			return this;
		} else
			return this[0] && this[0].textContent;
	},
	/**
	* Get the current value of the first element in the set of matched elements.
	* @memberof HBrowser#
	* @returns {String}
	*//**
	* Set the value of each element in the set of matched elements.
	* @memberof HBrowser#
	* @param {String} value Value
	* @returns {this}
	*/
	val: function(val) {
		if(typeof val=='string') {
			this.forEach(e=>e.value=val);
			return this;
		} else
			return this[0] && this[0].value;
	},
	/**
	* Iterate over a jQuery object, executing a function for each matched element.
	* @memberof HBrowser#
	* @param {Function} function Function to execute
	* @returns {this}
	*/
	each: function(cb) {
		this.forEach((e, i)=>cb.call(H(e), e, i));
		return this;
	},
	/**
	* Retrieve the elements matched as a vanilla Array.
	* @memberof HBrowser#
	* @returns {Node}
	*//**
	* Retrieve one of the elements matched.
	* @memberof HBrowser#
	* @param {Number} index Index of the element to return
	* @returns {Node}
	*/
	get: function(index) {
		if(index)
			return this[index];
		else
			return [...this];
	},
	/**
	* Adds the specified class(es) to each element in the set of matched elements
	* @memberof HBrowser#
	* @param {String} className Class name
	* @returns {this}
	*/
	addClass: function(c) {
		c.trim().split(' ').forEach(c=>{
			this.forEach(e=>e.classList.add(c));
		});
		return this;
	},
	/**
	* Remove a single class, multiple classes, or all classes from each element in the set of matched elements.
	* @memberof HBrowser#
	* @param {String} className Class name
	* @returns {this}
	*/
	removeClass: function(c) {
		c.trim().split(' ').forEach(c=>{
			this.forEach(e=>e.classList.remove(c));
		});
		return this;
	},
	/**
	* Add or remove one or more classes from each element in the set of matched elements, depending on either the class's presence or the value of the state argument.
	* @memberof HBrowser#
	* @param {String} className Class name
	* @returns {this}
	*/
	toggleClass: function(c) {
		c.trim().split(' ').forEach(c=>{
			this.forEach(e=>e.classList.toggle(c));
		});
		return this;
	},
	/**
	* Determine whether any of the matched elements are assigned the given class.
	* @memberof HBrowser#
	* @param {String} className Class name
	* @returns {Boolean}
	*/
	hasClass: function(c) {
		return this.some(e=>e.classList.contains(c));
	},
	/**
	* Reduce the set of matched elements to those that match the selector.
	* @memberof HBrowser#
	* @param {String} selector DOM Selector
	* @returns {this}
	*//**
	* Reduce the set of matched elements to those that match the function's test.
	* @memberof HBrowser#
	* @param {Function} fn Function used as a test for each elkement in the set.
	* @returns {this}
	*/
	filter: function(cb) {
		if(typeof cb == 'string')
			return addHProps(this.filter(e=>e.matches(cb)));
		else
			return addHProps(this.filter((e, i)=>cb.call(H(e), e, i)));
	},
	/**
	* Check the current matched set of elements against a selector and return true if at least one of these elements matches the given arguments.
	* @memberof HBrowser#
	* @param {String} selector DOM Selector
	* @returns {Boolean}
	*/
	is: function(sel) {
		return this.some(e=>e.matches(sel));
	},
	/**
	* Get the current coordinates of the first element in the set of matched elements, relative to the document.
	* @memberof HBrowser#
	* @returns {Object} \{top, left\}
	*/
	offset: function() {
		if(!this[0])
			return undefined;
		var rect = this[0].getBoundingClientRect();
		return {
			top: rect.top + window.scrollY,
			left: rect.left + window.scrollX
		};
	},

	/**
	* Attach an event handler function for one or more events to the selected elements.
	* @memberof HBrowser#
	* @param {String} events One or more space-separated event types and optional namespaces.
	* @param {String} selector A selector string to filter the descendants of the selected elements that trigger the event.
	* @param {Function} callback Event Handler
	* @param {Object} options Additional options for .addEventListener
	* @returns {this}
	*/
	on: function(events, sel, cb, opts) {
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
			if(sel) {
				if(H(e.target).closest(sel).length==0) // Skip if it doesn't have a parent matching sel
					return;
			}
			return cb.call(H(this), e, ...(H.isArray(e.detail)?e.detail:[]));
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
	},
	/**
	* Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
	* @memberof HBrowser#
	* @param {String} events One or more space-separated event types and optional namespaces.
	* @param {String} selector A selector string to filter the descendants of the selected elements that trigger the event.
	* @param {Function} callback Event Handler
	* @param {Object} options Additional options for .addEventListener
	* @returns {this}
	*/
	one: function(events, sel, cb, opts) {
		if(typeof sel!='string') {
			cb = cb || {};
			cb.once = true;
		} else {
			opts = opts || {};
			opts.once = true;
		}
		return this.on(events, sel, cb, opts);
	},
	/**
	* Remove an event handler.
	* @memberof HBrowser#
	* @param {String} events One or more space-separated event types and optional namespaces.
	* @param {Function} callback Event Handler
	* @returns {this}
	*/
	off: function(events, cb) {
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
	},
	/**
	* Execute all handlers and behaviors attached to the matched elements for the given event type.
	* @memberof HBrowser#
	* @param {String} event Event types and optional namespaces.
	* @param {Array<Mixed>} extraParams Additional parameters to pass along to the event handler.
	* @returns {this}
	*/
	trigger: function(event, params) {
		let parts = event.split('.');
		let eventName = parts.shift() || null;
		let namespace = parts.join('.') || null;
		if(!eventName)
			return this;
		var event = new CustomEvent(eventName, {
			detail : params
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
	},
	/**
	* Execute all handlers attached to an element for an event.
	* @memberof HBrowser#
	* @param {String} event Event types and optional namespaces.
	* @param {Array<Mixed>} extraParams Additional parameters to pass along to the event handler.
	* @returns {Mixed}
	*/
	triggerHandler: function(event, params) {
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
	},
};

window.H = H;

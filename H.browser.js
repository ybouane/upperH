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
window.H = H;

require('./H.common.js')(H);



const addHProps = (arr) => {
	arr.find = function(sel) {
		return addHProps(this.map(e=>Array.from(e.querySelectorAll(sel))).flat());
	};
	arr.closest = function(sel) {
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
	};
	arr.parents = function(sel) {
		var parents = [];
		var el = this[0];
		while(el) {
			el = el.parentElement;
			if(el)
				parents.push(el);
		}
		return addHProps(parents);
	};
	arr.parent = function(sel) {
		return addHProps(this.get().map(ele=>ele.parentElement));
	};
	arr.children = function(sel) {
		return addHProps(this.map(e=>e.childNodes.filter(e=>e.matches(sel))).flat());
	};
	arr.siblings = function(sel) {
		return addHProps(this.map(e=>{
			return Array.from(e.parentNode.children).filter(ele=>ele!=e && (!sel || ele.matches(sel)));
		}).flat());
	};
	arr.first = function(sel) {
		return addHProps([this[0]]);
	};
	arr.last = function(sel) {
		return addHProps([this[this.length-1]]);
	};
	arr.attr = function(attr, val) {
		if(typeof val=='string') {
			this.forEach(e=>e.setAttribute(attr, val));
			return this;
		} else
			return this[0] && this[0].getAttribute(attr);
	};
	arr.removeAttr = function(attr) {
		this.forEach(e=>e.removeAttribute(attr));
		return this;
	};
	arr.show = function() {
		return this.css('display', '');
	};
	arr.hide = function() {
		return this.css('display', 'none');
	};
	arr.prop = function(key, val) {
		if(typeof val=='string') {
			this.forEach(e=>e[key]=val);
			return this;
		} else
			return this[0] && this[0][key];
	};
	arr.css = function(key, value, important) {
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
	};
	arr.append = function(sel) {
		this.forEach(el=>{
			var ch = H(sel);
			for(let child of ch)
				el.appendChild(child);
		});
		return this;
	};
	arr.appendTo = function(sel) {
		H(sel).append(this);
		return this;
	};
	arr.prepend = function(sel) {
		this.forEach(el=>{
			var ch = H(sel).reverse();
			for(let child of ch)
				el.insertBefore(child, el.firstChild);
		});
		return this;
	};
	arr.prependTo = function(sel) {
		H(sel).prepend(this);
		return this;
	};
	arr.empty = function() {
		this.forEach(el=>{
			while(el.firstChild)
				el.removeChild(el.firstChild);
		});
		return this;
	};
	arr.remove = function(sel) {
		this.forEach(el=>{
			el.parentNode.removeChild(el);
		});
		return;
	};
	arr.eq = function(index) {
		return addHProps([this[index]]);
	};
	arr.index = function() {
		if (!this[0])
			return -1;
		var cEle = this[0];
		let index = 0;
		while(cEle.previousElementSibling) {
			index++;
			cEle = cEle.previousElementSibling;
		}
		return index;
	};
	arr.html = function(val) {
		if(typeof val=='string') {
			this.forEach(e=>e.innerHTML=val);
			return this;
		} else
			return this[0] && this[0].innerHTML;
	};
	arr.text = function(val) {
		if(typeof val=='string') {
			this.forEach(e=>e.textContent=val);
			return this;
		} else
			return this[0] && this[0].textContent;
	};
	arr.val = function(val) {
		if(typeof val=='string') {
			this.forEach(e=>e.value=val);
			return this;
		} else
			return this[0] && this[0].value;
	};
	arr.each = function(cb) {
		this.forEach((e, i)=>cb.call(H(e), e, i));
		return this;
	};
	arr.get = function(index) {
		if(index)
			return this[index];
		else
			return [...this];
	};
	arr.addClass = function(c) {
		this.forEach(e=>e.classList.add(c));
		return this;
	};
	arr.removeClass = function(c) {
		this.forEach(e=>e.classList.remove(c));
		return this;
	};
	arr.toggleClass = function(c) {
		this.forEach(e=>e.classList.toggle(c));
		return this;
	};
	arr.hasClass = function(c) {
		return (this[0] && this[0].classList.contains(c)) || false;
	};
	arr.filter = function(cb) {
		return addHProps(this.filter((e, i)=>cb.call(H(e), e, i)));
	};
	arr.is = function(sel) {
		if(!this[0])
			return false;
		return this[0].matches(sel);
	};
	arr.offset = function() {
		if(!this[0])
			return undefined;
		var rect = this[0].getBoundingClientRect();
		return {
			top: rect.top + window.scrollY,
			left: rect.left + window.scrollX
		};
	};

	arr.on = function(events, sel, cb, opts) {
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
	};
	arr.one = function(events, sel, cb, opts) {
		if(typeof sel!='string') {
			cb = cb || {};
			cb.once = true;
		} else {
			opts = opts || {};
			opts.once = true;
		}
		return this.on(events, sel, cb, opts);
	};
	arr.off = function(events, cb) {
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
	};
	arr.trigger = function(event, params) {
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
	};
	arr.triggerHandler = function(event, params) {
		let parts = event.split('.');
		let eventName = parts.shift() || null;
		let namespace = parts.join('.') || null;
		if(!eventName)
			return undefined;
		var event = new CustomEvent(eventName, {
			detail : params
		});
		for(let ele of this) {
			ele.attachedEvents = ele.attachedEvents || [];
			for(let ev of ele.attachedEvents) {
				if(eventName==ev.eventName && (!namespace || namespace==ev.namespace))
					return ev.handler.call(ele, event);
			}
		}
		return undefined;
	};
	return arr;
}

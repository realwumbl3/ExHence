/** Inject a script into the page and remove it after it's loaded
* @param {String} src - The URL of the script to inject
*/
export function injectScript(src) {
	const script = document.createElement("script");
	script.type = "text/javascript";
	script.src = src;
	document.body.appendChild(script);
	script.addEventListener("load", () => script.remove());
}

/** Extract all links and images from a dom object
* @param {String} html
* @returns {links[String], imgs[String]}
*/
export function extractImagesAndLinks(doc) {
	// Example: Extract all links from the page
	const links = [...doc.querySelectorAll('a')].map(a => a.href);
	const imgs = [...doc.querySelectorAll('img')].map(img => img.src);
	return { links, imgs };
}

/** Fetch the full page content and return a document object for parsing or an error object
* @param {String} url
* @returns {doc[Document], error[Error]}
*/
export async function fetchDocument(url) {
	try {
		const response = await fetch(url);
		const html = await response.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		return doc;
	} catch (error) {
		console.error('Error fetching the page:', error);
		throw error;
	}
}

class singleCallSet extends Set {
	constructor(...args) {
		super(...args)
	}
	call(thing, func) {
		if (this.has(thing)) return
		this.add(thing)
		func(thing)
	}
}

export function observe(container, query, func, once) {
	'use strict';
	once = once || false
	const nmo = new MutationObserver((mutationsList) => {
		const set = new singleCallSet()
		for (const mutation of mutationsList) if (mutation.type === 'childList') {
			for (const node of mutation.addedNodes) {
				if (!node || node.nodeType !== 1) continue
				if (node.matches?.(query)) {
					set.call(node, () => func(node))
					if (once) return nmo.disconnect()
				}
				else if (node.querySelectorAll(query).length > 0) {
					for (const elem of node.querySelectorAll(query))
						set.call(elem, () => func(elem));
					if (once) return nmo.disconnect()
				}
			}
		}
	})
	nmo.observe(container, { childList: true, subtree: true })
	return nmo
}

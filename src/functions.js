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

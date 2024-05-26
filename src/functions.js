export function injectScript(src) {
	const script = document.createElement("script");
	script.type = "text/javascript";
	script.src = src;
	document.body.appendChild(script);
	script.addEventListener("load", () => script.remove());
}

/**
 * 
 * @param {String} html
 * @returns {links[String], imgs[String]}
 */
export function extractImagesAndLinks(doc) {
	// Example: Extract all links from the page
	const links = [...doc.querySelectorAll('a')].map(a => a.href);
	const imgs = [...doc.querySelectorAll('img')].map(img => img.src);
	return { links, imgs };
}

// Function to fetch the full page content
export async function fetchDocument(url) {
	try {
		const response = await fetch(url);
		const html = await response.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		return { doc };
	} catch (error) {
		console.error('Error fetching the page:', error);
		return { error };
	}
}

export function pageType(url) {
	if (url.startsWith("/g/")) return "gallery";
	if (url.startsWith("/s/")) return "view";
	if (url.startsWith("/")) return "home";
	return "unknown";
}

export async function favoritePost(url) {
	const [gid, t] = url.split("/").slice(-3);
	const formUrl = `https://exhentai.org/gallerypopups.php?gid=${gid}&t=${t}&act=addfav`;
	const formData = new FormData();
	formData.append("favcat", 0);
	formData.append("favnote", "");
	formData.append("apply", "Apply Changes");
	formData.append("update", 1);
	const response = await fetch(formUrl, {
		method: "POST",
		credentials: "include",
		body: formData,
	});
	if (response.ok) {
		console.log("Post favorited.");
	}
	if (!response.ok) {
		console.error("Failed to favorite post.", { response });
	}
	return response;
}

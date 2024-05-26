chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	asyncMessageHandling(request, sender, sendResponse).then((results) => {
		console.log("asyncMessageHandling done");
		sendResponse(results);
	}).catch(error => {
		console.error('Error in asyncMessageHandling:', error);
		sendResponse({ error: 'Failed to handle message' });
	});
	return true; // Required for asynchronous sendResponse
});

async function asyncMessageHandling(request, sender, sendResponse) {
	console.log("asyncMessageHandling", { request, sender, sendResponse });
	if (request === "getTab") return { id: sender.tab.id }
	if (request.func === "chrome.downloads.download") chrome.downloads.download({ url: request.url });
	if (request.func === 'fetchPageContent') {
		const html = await fetchPageContent(request.url);
		return { html }
	}
}

// Function to fetch the full page content
async function fetchPageContent(url) {
	try {
		const response = await fetch(url);
		const text = await response.text();
		return text;
	} catch (error) {
		console.error('Error fetching the page:', error);
	}
}

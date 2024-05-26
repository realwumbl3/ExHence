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
}

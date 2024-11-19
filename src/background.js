async function asyncMessageHandling(request, sender, sendResponse) {
	console.log("asyncMessageHandling", { request, sender, sendResponse });
	if (request === "getTab") return { id: sender.tab.id }
	if (request.func === "chrome.downloads.download") chrome.downloads.download({ url: request.url });
	if (request.func === "loadImageToByte64") {
		const byte64 = await loadImageToByte64(request.src);
		return { byte64 };
	}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	asyncMessageHandling(request, sender, sendResponse).then((results) => {
		console.log("asyncMessageHandling done");
		sendResponse(results);
	}).catch(error => {
		console.error('Error in asyncMessageHandling:', error);
		sendResponse({ error: 'Failed to handle message', message: error.message });
	});
	return true; // Required for asynchronous sendResponse
});

async function loadImageToByte64(src) {
	const fet = await fetch(src, { mode: "cors" });
	const blob = await fet.blob();
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	return new Promise((res, rej) => {
		reader.onloadend = () => res(reader.result);
	});
}

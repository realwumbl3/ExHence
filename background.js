chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("onMessage", { request, sender, sendResponse });
	if (request === "getTab") sendResponse({ id: sender.tab.id })
	if (request.command === "downloadInBackground") downloadInBackground(request.url);
	return true;
});

async function downloadInBackground(url) {
	chrome.downloads.download({ url });
}
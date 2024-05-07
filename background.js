chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log("onMessage", { request, sender, sendResponse });
	if (request === "getTab") sendResponse({ id: sender.tab.id })
	return true;
});

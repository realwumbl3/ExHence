async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	console.log("onMessage", request, sender, sendResponse);

	if (request.ping === "ping") {
		sendResponse({ pong: "pong" });
	}

});

(async () => {
	console.log("getCurrentTab", await getCurrentTab());
})();

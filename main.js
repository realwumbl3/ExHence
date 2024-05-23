(async () => {
	try {
		await import(chrome.runtime.getURL("./src/exhentai-ctrl.js"));
	} catch (error) {
		console.error("Error importing exhentai-ctrl.js:", error);
	}
})();

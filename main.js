(async () => {
	try {
		await import(chrome.runtime.getURL('exhentai-ctrl.js'));
	} catch (error) {
		console.error('Error importing exhentai-ctrl.js:', error);
	}
})();

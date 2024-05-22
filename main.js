(async () => {
	try {
		console.log('Importing exhentai-ctrl.js...');
		await import(chrome.runtime.getURL('./src/exhentai-ctrl.js'));
		console.log('exhentai-ctrl.js imported successfully.');
	} catch (error) {
		console.error('Error importing exhentai-ctrl.js:', error);
	}
})();

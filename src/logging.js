export default function SetupLogging() {
	window.onerror = async function (msg, url, line) {
		if (url.endsWith("logging.js") || url.endsWith("logging.min.js")) return console.error("[Error in logging.js]", { msg, url, line })
		const request = {
			type: "error",
			message: msg,
			url: url,
			line: line,
		};
		const fetchOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		};
		try {
			await fetch("https://ext.wumbl3.xyz/logging", fetchOptions);
		} catch (error) {
			console.error("[Error sending error log]", error);
		}
	};
}

// implement into js-logging
export default function SetupLogging() {
	window.onerror = async function (msg, url, line) {
		if (url.endsWith("logging.js") || url.endsWith("logging.min.js")) return console.error("[Error in logging.js]", { msg, url, line })
		const body = {
			type: "error",
			message: msg,
			url: url,
			line: line,
		};
		try {
			await fetch("https://ext.wumbl3.xyz/logging", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});
		} catch (error) {
			console.error("[Error sending error log]", error);
		}
	};
}

export class Logging {
	#history;
	#verbose;
	constructor({ verbose = false } = {}) {
		this.#verbose = verbose;
		this.#history = [];
		this.log("Logging initialized.");
	}

	log(level, ...args) {
		const entry = [`[Logging] level:${level} |`, ...args];
		this.#history.push(entry);
		this.#history.length > 100 && this.#history.shift();
		this.#verbose && console.log(...entry);
	}

	info(...args) {
		this.log("info", ...args);
	}

	debug(...args) {
		this.log("debug", ...args);
	}

	warn(...args) {
		this.log("warn", ...args);
	}

	assert(condition, message) {
		if (!condition) this.log("Assertion failed:", message) && console.trace();
	}

}

import zyX, { css, timeoutLimiter } from "./zyX-es6.js";

import { injectScript } from "./dependencies.js";
import ExtendHeader from "./header.js";

css`
`;
// @import url(${chrome.runtime.getURL("src/@css/css.css")});


injectScript(chrome.runtime.getURL("src/overrides.js"));

import SetupLogging from "./logging.js";

// SetupLogging();

export function pageType(url) {
	if (url.startsWith("/g/")) return "gallery";
	if (url.startsWith("/s/")) return "view";
	if (url.startsWith("/")) return "home";
	return "unknown";
}

import ExGallery from "./gallery.js";
import ExView from "./view.js";

export default class ExHence {
	constructor() {
		this.verbose = false;

		this.options = {
			autoScrollPadding: 250,
			pageNav: "sides", // sides / first/last
			bttmOut: "nothing", // nothing / prev/next
			defaultSelect: "center", // center / first
			viewBehavior: "scrollZoom", // scrollZoom / scrollPan
		};

		this.state = {
			galleryHistory: [],
		};
		this.page = this.getPath();
		this.pageType = pageType(this.page);

		this.thisTabID = null;

		this.keyTimeout = new timeoutLimiter(100); // Prevents multiple keypresses in quick succession.
		this.cooledDownStart = false;
		this.coolDownPause(200); // Prevents keypresses on page load to prevent spamming requests.

		this.vanillaHeader = document.querySelector("#nb");
		if (this.vanillaHeader) this.header = new ExtendHeader(this, this.vanillaHeader);

		window.addEventListener("keydown", this.keydown.bind(this));

		this.asynconstructor();
	}

	async asynconstructor() {
		await this.loadTab();

		const gallery = document.querySelector("#gdt, .itg.gld, .itg.glte");
		if (gallery) this.gallery = new ExGallery(this, gallery);

		const view = document.querySelector(".sni");
		if (view) this.view = new ExView(this, view);
	}

	log(...args) {
		this.verbose && console.log("[ExHentaiCTRL] |", ...args);
	}

	logSelf() {
		this.log("this", this);
	}

	storePageInHistory() {
		if (
			this.state.galleryHistory.length === 0 ||
			this.state.galleryHistory[0].path !== this.page
		) {
			this.state.galleryHistory.unshift({ path: this.page });
			this.saveState();
		}
	}

	goToLocation(url) {
		window.location = window.location.origin + url || "/";
	}

	getPath() {
		return window.location.href.split(window.location.origin)[1];
	}

	coolDownPause(timeout) {
		const init = this.cooledDownStart;
		this.cooledDownStart = true;
		setTimeout(() => (this.cooledDownStart = false), timeout || 200);
		return init;
	}

	async loadOptions() {
		return new Promise((res, rej) => {
			chrome.storage.local.get(["ExHentaiCTRL"], async (result) => {
				if (!result.hasOwnProperty("ExHentaiCTRL")) {
					this.log("[ExHentaiCTRL] | No options set yet.");
					this.saveOptions();
					return res(true);
				}
				this.options = result["ExHentaiCTRL"];
				this.log("[ExHentaiCTRL] | loaded options ", this.options);
				res(true);
			});
		});
	}

	saveOptions() {
		chrome.storage.local.set({ ExHentaiCTRL: this.options }, () => {
			this.log("[ExHentaiCTRL] | saved options ", this.options);
		});
	}

	async getTabID() {
		return new Promise((res, rej) => {
			chrome.runtime.sendMessage("getTab", (response) => {
				if (!response.hasOwnProperty("id"))
					return console.error(
						"[ExHentaiCTRL] | No tab id response from background worker."
					);
				res(response.id);
			});
		});
	}

	async loadTab() {
		await this.loadOptions();
		this.thisTabID = await this.getTabID();
		return new Promise((res, rej) => {
			const stateId = `${this.thisTabID}-state`;
			chrome.storage.local.get([stateId], (result) => {
				if (!result[stateId]) {
					this.log("No init state set yet.");
					return res(true);
				}
				this.state = result[stateId];
				this.log("[ExHentaiCTRL] | restored state ", this.state);
				res(true);
			});
		});
	}

	saveState() {
		this.state.galleryHistory = this.state.galleryHistory.splice(0, 200);
		chrome.storage.local.set({ [`${this.thisTabID}-state`]: this.state }, () => {
			this.log("[ExHentaiCTRL] | saved state ", this.state);
		});
	}

	clearState() {
		this.state = { galleryHistory: [] };
		this.storePageInHistory();
	}

	keydown(e) {
		if (document.body.querySelector("input:focus, textarea:focus")) return; // ignore if any input feild is focused\
		if (!this.keyTimeout(e.code) || this.cooledDownStart) return;
		switch (e.code) {
			case "KeyE":
			case "Enter":
				if (e.shiftKey) {
					if (this.pageType === "gallery") return this.gallery.highlight.download();
					if (this.pageType === "view") return this.view.download();
				}
				if (this.gallery) return this.gallery.highlight.goToHref();
				break;
			case "KeyQ":
			case "Backspace":
				return this.pressQ();
			case "KeyL":
				return this.logSelf();
			case "KeyX":
				return this.goToLocation("/");
			case "KeyF":
				if (e.shiftKey) {
					if (this.gallery) return this.gallery.favoriteHighlighted();
				}
				return this.goToLocation("/favorites.php");
			case "KeyP":
				return this.goToLocation("/popular");
			case "KeyG":
				return this.goToLocation("/watched");
			case "KeyW":
			case "KeyA":
			case "KeyS":
			case "KeyD":
			case "ArrowUp":
			case "ArrowLeft":
			case "ArrowDown":
			case "ArrowRight":
				e.preventDefault();
				if (this.gallery) return this.gallery.moveHighlight(e);
			case "Home":
				e.preventDefault();
				if (this.gallery)
					return this.gallery.selectThumbnail(this.gallery.getGalleryNodes()[0]);
			case "End":
				e.preventDefault();
				if (this.gallery)
					return this.gallery.selectThumbnail(
						this.gallery.getGalleryNodes().slice(-1)[0]
					);
		}
	}

	pressQ() {
		if (this.state.galleryHistory.length > 0) {
			const previous = this.state.galleryHistory.find((_) => _.path !== this.page);
			if (!previous) return false;
			this.state.galleryHistory = this.state.galleryHistory.splice(
				this.state.galleryHistory.indexOf(previous)
			);
			this.saveState();
			this.verbose && console.log("going to", previous);
			if (this.coolDownPause(1000)) return;
			window.location = previous.path;
			return;
		}
	}
}

export const exHence = new ExHence();

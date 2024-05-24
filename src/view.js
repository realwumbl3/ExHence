import zyX, { html, css } from "./zyX-es6.js";

import { ZyXImage } from "./dependencies.js";

export default class ExView {
	constructor(Exhence, view) {
		this.Exhence = Exhence;
		this.container = view;
		this.header = this.container.firstChild;

		this.zyXImg = new ZyXImage({ src: this.getImgSrc() });

		html`
			<div this=main class=ExView>${this.zyXImg.element}</div>
		`
			.bind(this)
			.const();

		this.container.after(this.main);

		window.addEventListener("message", (event) => {
			if (event.source != window) return; // We only accept messages from the current window
			if (event.data?.type === "APPLY_JSON_STATE") this.viewUpdated();
		});

		this.viewPopulated();
	}

	getImgSrc() {
		return this.container.querySelector("#i3 img").src;
	}

	viewUpdated() {
		this.viewPopulated();
	}

	// navigation between pages is loaded in dynamically, we need to remodify the view each time.
	async viewPopulated() {
		const viewChildren = [...this.container.children];
		this.Exhence.log("[ExHentaiCTRL] | viewPopulated", viewChildren);
		const { i2, i3, i4, i5, i6 } = Object.fromEntries(
			viewChildren.map((_) => [_.id || _.tagName.toLowerCase(), _])
		);
		this.zyXImg.resetTransform();
		this.zyXImg.src = this.getImgSrc();
	}

	getViewDownload() {
		const downloadButton = this.container
			.querySelector("#i6")
			.lastChild.querySelector("a").href;
		if (downloadButton.startsWith("https://exhentai.org/fullimg/")) return downloadButton;
		const viewImage = this.container.querySelector("#img").src;
		if (viewImage) return viewImage;
		this.Exhence.log("[ExHentaiCTRL] | No download link found.");
	}

	async downloadView() {
		const viewDownload = this.getViewDownload();
		if (this.Exhence.coolDownPause(1000)) return;
		chrome.runtime.sendMessage({ func: "chrome.downloads.download", url: viewDownload });
		this.Exhence.log("[ExHentaiCTRL] | downloadView", viewDownload);
	}
}

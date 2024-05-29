import zyX, { html } from "./zyX-es6.js";

import ExHence from "./main.js";
import showOptions from "./options.js";
import { CustomEHLogo } from "./header.js";

import {
	ZyXImage, ZoomAndPan, SHIFT_PAN, SHIFT_ZOOM
} from "./zyXImage.js";

export default class ExView {
	/**
	 * 
	 * @param {ExHence} ExHence - ExHence instance
	 * @param {view} HTMLElement - Vanilla view element
	 */
	constructor(ExHence, view) {
		this.ExHence = ExHence;
		this.container = view;
		this.header = this.container.firstChild;

		this.links = {
			first: null,
			prev: null,
			next: null,
			last: null,
		};

		this.zyXImg = new ZyXImage({ src: this.getImgSrc() });

		html`
			<div this=main class=ExView>
				<div this=header class="ExViewHeader Visible">
					<div class=ExViewHeaderLeft>
						${CustomEHLogo}
						<span class="Spacer"></span>
						<span class="ExButton" zyx-click="${this.download.bind(this)}">Download</span>
						<span class="ExButton" zyx-click="${_ => this.links.first.click()}">&lt&lt</span>
						<span class="ExButton" zyx-click="${_ => this.links.prev.click()}">&lt</span>
						<span this=range class="Range" zyx-uplate>{x{--}} / {of{--}}</span>
						<span class="ExButton" zyx-click="${_ => this.links.next.click()}">&gt</span>
						<span class="ExButton" zyx-click="${_ => this.links.last.click()}">&gt&gt</span>
						<span class="Spacer"></span>
						<span class="ExButton" zyx-click="${showOptions.bind(this.ExHence)}">Options</span>
					</div>
					<div class="ExViewHeaderRight">
						<div this=info class=Info zyx-uplate>
							<b>Post</b> ⠕ {post{}} ⠪</br >
							<b>Page</b> ⠕ {page{}} ⠪
						</div>
						<span class="ExButton" zyx-click="${_ => this.ExHence.pressQ()}">Back</span>
					</div>
				</div>
				<div class=ImageContainer>
					${this.zyXImg.element}
				</div>
			</div>
		`
			.bind(this)
			.const();

		this.container.after(this.main);

		this.panZoom = new ZoomAndPan(this.zyXImg.element, {
			wheelDeterminer: (e) => {
				if (this.ExHence.options.viewBehavior === "scrollZoom") {
					return e.shiftKey ? SHIFT_PAN : SHIFT_ZOOM;
				} else {
					return e.shiftKey ? SHIFT_ZOOM : SHIFT_PAN;
				}
			}
		})

		window.addEventListener("message", (event) => {
			if (event.source != window) return; // We only accept messages from the current window
			if (event.data?.type === "APPLY_JSON_STATE") this.viewPopulated();
		});

		this.main.addEventListener("pointermove", (e) => {
			const infield = e.clientY < window.innerHeight / 4
			if (infield) return this.showHeaderFor(0);
			this.hideHeader();
		});

		this.viewPopulated();
	}
	/**
	 * 
	 * @param {number} time - Time in milliseconds to show the header for. If 0, the header will not hide. 
	 */
	showHeaderFor(time = 1000) {
		this.header.classList.add("Visible");
		if (time) zyX(this).delay("headerhide", time, () => this.hideHeader());
		else zyX(this).clearDelay("headerhide");
	}

	hideHeader() {
		this.header.classList.remove("Visible");
	}

	getImgSrc() {
		return this.container.querySelector("#i3 img").src;
	}

	// navigation between pages is loaded in dynamically, we need to remodify the view each time.
	async viewPopulated() {
		this.ExHence.logging.debug("[ExView.viewPopulated]", this.container);

		const viewChildren = [...this.container.children];
		const { h1, i2, i3, i4, i5, i6 } = Object.fromEntries(
			viewChildren.map((_) => [_.id || _.tagName.toLowerCase(), _])
		);
		const postTitle = h1.textContent;
		const [filename, resolution, size] = i4.firstChild.textContent.split(" :: ");
		const navigator = i4.querySelector(".sn")
		const [first, prev, range, next, last] = [...navigator.children];
		const [current, total] = range.textContent.split(" / ").map(_ => parseInt(_));

		this.links = { first, prev, next, last }

		this.range.flash({ x: current, of: total });
		this.info.flash({ post: postTitle, page: filename });
		this.info.title = `${resolution} ⠪ ⠕ ${size}`;

		this.panZoom.resetTransform();
		this.zyXImg.src = this.getImgSrc();

		this.showHeaderFor(2000);
	}

	getViewDownload() {
		const downloadButton = this.container
			.querySelector("#i6")
			.lastChild.querySelector("a").href;
		if (downloadButton.startsWith(`${window.location.origin}/fullimg/`)) return downloadButton;
		const viewImage = this.container.querySelector("#img").src;
		if (viewImage) return viewImage;
		this.ExHence.logging.error("[ExView.getViewDownload], No download link found.");
	}

	async download() {
		const viewDownload = this.getViewDownload();
		if (this.ExHence.coolDownPause(1000)) return;
		chrome.runtime.sendMessage({ func: "chrome.downloads.download", url: viewDownload });
		this.ExHence.logging.debug("[ExView.download]", viewDownload);
	}
}

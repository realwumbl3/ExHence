import zyX, { html, css } from "./zyX-es6.js";

import { firstInView } from "./dependencies.js";
import { pageType } from "./main.js";

css`
	@import url("${chrome.runtime.getURL("src/@css/gallery.css")}");
`

export default class ExGallery {
	constructor(ExHence, gallery) {
		this.ExHence = ExHence;
		this.ExHence.log("[new ExGallery.contructor]", gallery);

		this.ExHence.storePageInHistory();

		const currentState = this.ExHence.state.galleryHistory[0];
		const previousState = this.ExHence.state.galleryHistory[1];
		// If we're in a gallery and the previous state was also a gallery, remove the previous state.
		// This is so going back from a gallery goes back to the page that led to the gallery istead of the previous gallery page.
		if (previousState && pageType(previousState.path) === "gallery") {
			this.ExHence.state.galleryHistory.splice(1, 1);
			this.ExHence.saveState();
		}

		this.container = gallery;
		if (gallery.matches(".itg.glte")) { // Extended view nodes are wrapped in a table container.
			gallery = gallery.firstChild;
		}
		this.prev = null;
		this.next = null;
		this.thumbnail = {
			active: null,
		};
		this.readNavBar();
		this.restorePageState(currentState);

		let initiallySelected = this.ExHence.options.defaultSelect === "center" ? this.getCenterish() : 0;
		initiallySelected = Math.min(initiallySelected, this.getGalleryNodes().length - 1);
		this.selectThumbnail(this.selectedThumbnail || this.getGalleryNodes()[initiallySelected]);
	}

	getCenterish() {
		const columnCount = this.calculateGrid();
		const centerish = Math.floor(columnCount / 2)
		return columnCount % 2 ? centerish : centerish - 1;
	}

	readNavBar() {
		const galleryNavBar = [...document.querySelectorAll("#uprev,#unext")];
		if (galleryNavBar.length === 2) {
			this.ExHence.log("[ExGallery.readNavBar] Read gallery nav bar");
			this.prev = galleryNavBar[0]?.href;
			this.next = galleryNavBar[1]?.href;
		} else {
			this.ExHence.log("[ExGallery.readNavBar] Read comic nav bar");
			const comicNavBar = [...document.querySelectorAll("table.ptt>tbody>tr>td")];
			this.prev = comicNavBar[0].firstChild?.href;
			this.next = comicNavBar[comicNavBar.length - 1].firstChild?.href;
		}
	}

	restorePageState(state) {
		const lastThumbnailHref = state.selectedThumb;
		if (!lastThumbnailHref) return console.log("No last thumbnail href found in state.");
		const selectedThumb = this.getGalleryNodes().find(
			(node) => node.querySelector("a").href === lastThumbnailHref
		);
		if (!selectedThumb)
			return console.log(
				"No thumbnail found in gallery for last thumbnail href in state."
			);
		this.selectedThumbnail = selectedThumb;
	}

	getGalleryNodes() {
		return [...this.container.childNodes].filter((_) => _.childNodes.length > 0);
	}

	calculateGrid() {
		return Math.floor(this.container.clientWidth / this.container.firstChild.clientWidth);
	}

	selectThumbnail(node) {
		if (!node) return false;
		this.selectedThumbnail?.classList.remove("highlighted-thumb");
		this.selectedThumbnail = node;
		this.selectedThumbnail.classList.add("highlighted-thumb");
		this.boundsCheck(node);
		const selectedHref = node.querySelector("a").href;
		this.ExHence.state.galleryHistory[0].selectedThumb = selectedHref;
		this.ExHence.saveState();
	}

	moveHighlight(e) {
		const collums = this.calculateGrid();
		const nodes = this.getGalleryNodes();
		let nodeIndex = nodes.indexOf(this.selectedThumbnail);
		switch (e.code) {
			case "KeyW": // UP
			case "ArrowUp":
				nodeIndex -= collums;
				if (nodeIndex < 0) {
					// OUT OF BOUNDS, (BELOW FIRST ROW)
					return window.scrollTo(0, 0);
				}
				break;
			case "KeyS": // DOWN
			case "ArrowDown":
				nodeIndex += collums;
				if (nodeIndex > nodes.length - 1) {
					// OUT OF BOUNDS, (BEYOND LAST ROW)
					if (this.ExHence.options.bttmOut === "next" && this.navigateTo("next"))
						return;
				}
				break;
			case "KeyA": // LEFT
			case "ArrowLeft":
				nodeIndex--;
				if ((nodeIndex + 1) % collums === 0) {
					// ALREADY ON FIRST COLUMN
					if (nodeIndex === -1) {
						// OUT OF BOUNDS, (BEFORE FIRST THUMBNAIL)
						if (this.ExHence.options.pageNav === "first/last" && this.navigateTo("prev"))
							return;
					}
					if (this.ExHence.options.pageNav === "sides" && this.navigateTo("prev")) return;
				}
				break;
			case "KeyD": // RIGHT
			case "ArrowRight":
				nodeIndex++;
				if (nodeIndex % collums === 0) {
					// ALREADY ON LAST COLUMN
					if (nodeIndex === nodes.length) {
						// OUT OF BOUNDS, (AFTER LAST THUMBNAIL)
						if (this.ExHence.options.pageNav === "first/last" && this.navigateTo("next"))
							return;
					}
					if (this.ExHence.options.pageNav === "sides" && this.navigateTo("next")) return;
				}
				break;
		}
		this.selectThumbnail(nodes[nodeIndex]);
	}

	pressEonThumb() {
		const thumbnailAnchor = this.selectedThumbnail.querySelector("a");
		window.location = thumbnailAnchor.href;
	}

	navigateTo(direction) {
		const goto = direction === "prev" ? this.prev : this.next;
		if (!goto) return false;
		if (this.ExHence.coolDownPause(1000)) return;
		window.location = goto;
		return true;
	}

	boundsCheck(node) {
		const nodeBounds = node.getBoundingClientRect();
		const padding = this.ExHence.options.autoScrollPadding;
		const headerPadding = this.ExHence.vanillaHeader.clientHeight;
		switch (true) {
			case nodeBounds.top < 0:
				window.scrollTo(0, window.scrollY + nodeBounds.top - (padding + headerPadding));
				break;
			case nodeBounds.bottom > window.innerHeight:
				window.scrollTo(
					0,
					window.scrollY + nodeBounds.bottom - window.innerHeight + padding
				);
				break;
		}
	}
}

import zyX, { pointerEventPathContainsMatching } from "./zyX-es6.js";

import ExHence, { pageType, favoritePost } from "./main.js";
import HighlightedThumb from "./highlight.js";

export default class ExGallery {
	/**
	 *	@param {ExHence} ExHence - ExHence instance
	 *	@param {gallery} HTMLElement - Vanilla gallery element
	 */
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

		if (gallery.matches(".itg.glte")) { // Extended view nodes are wrapped in a table container.
			gallery = gallery.firstChild;
		}

		this.container = gallery;

		this.prev = null;
		this.next = null;
		this.readNavBar();

		this.highlight = new HighlightedThumb(this);

		this.restorePageState(currentState);

		if (!this.highlight.target) {
			let initiallySelected = this.ExHence.options.defaultSelect === "center" ? this.getCenterish() : 0;
			this.selectThumbnail(initiallySelected);
		}

		gallery.addEventListener("click", (e) => {
			const thumbnail = pointerEventPathContainsMatching(e, ".gdtl,.gl1t,tr:has(.gl1e,.gl2e)")
			if (thumbnail) {
				e.preventDefault();
				const targeting_a = pointerEventPathContainsMatching(e, "a");
				if (!targeting_a) return;
				const hrefType = pageType(targeting_a.href);
				if (hrefType !== "gallery" && hrefType !== "view") return
				this.selectThumbnail(thumbnail);
				zyX(this).delay("click", 100, () => {
					window.location = this.highlight.highlightedHref();
				});
			}
		}, { capture: true });
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
		if (!state.selectedThumb) return false;
		const selectedThumb = this.getGalleryNodes().find(
			(node) => node.querySelector("a").href === state.selectedThumb
		);
		if (selectedThumb) return this.selectThumbnail(selectedThumb);
	}

	getGalleryNodes() {
		return [...this.container.childNodes].filter((_) => _.childNodes.length > 0);
	}

	calculateGrid() {
		return Math.floor(this.container.clientWidth / this.container.firstChild.clientWidth);
	}

	selectThumbnail(nodeOrIndex) {
		if (typeof nodeOrIndex === "number") {
			if (nodeOrIndex < 0) nodeOrIndex = nodes.length + nodeOrIndex;
			const nodes = this.getGalleryNodes();
			nodeOrIndex = nodes[Math.min(Math.max(nodeOrIndex, 0), nodes.length - 1)];
		}
		if (!nodeOrIndex) return false;
		this.highlight.select(nodeOrIndex);
		this.highlight.boundsCheck();
		this.ExHence.state.galleryHistory[0].selectedThumb = this.highlight.highlightedHref();
		this.ExHence.saveState();
	}

	moveHighlight(e) {
		const collums = this.calculateGrid();
		const nodes = this.getGalleryNodes();
		let nodeIndex = this.highlight.indexInParent()
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
		this.selectThumbnail(nodeIndex);
	}

	navigateTo(direction) {
		const goto = direction === "prev" ? this.prev : this.next;
		if (!goto) return false;
		if (this.ExHence.coolDownPause(1000)) return;
		window.location = goto;
		return true;
	}

	selectFirstThumbnail() {
		this.selectThumbnail(0);
	}

	selectLastThumbnail() {
		this.selectThumbnail(-1);
	}

	favoriteHighlighted() {
		this.highlight.favorite();
		this.ExHence.header.highlightFavoriteButton();
	}

	favoriteGallery() {
		favoritePost(window.location.href);
		this.ExHence.header.highlightFavoriteButton();
	}

}

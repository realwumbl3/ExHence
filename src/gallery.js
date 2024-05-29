import zyX, { html, pointerEventPathContainsMatching } from "./zyX-es6.js";

import ExHence, { pageType, favoritePost } from "./main.js";
import HighlightedThumb from "./highlight.js";

export default class ExGallery {
	/**
	 *	@param {ExHence} ExHence - ExHence instance
	 *	@param {gallery} HTMLElement - Vanilla gallery element
	 */
	constructor(ExHence, gallery) {
		this.ExHence = ExHence;
		this.ExHence.logging.debug("[new ExGallery.contructor]", gallery);
		this.options = this.ExHence.options;

		if (this.options.blurThumbnails !== undefined) {
			document.body.classList.toggle("blurImages", this.options.blurThumbnails);
		}

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

		this.navUrls = {}; // { first: "", prev: "", next: "", last: "" }
		this.readNavBar();

		this.renderHeaderNav();

		this.highlight = new HighlightedThumb(this);

		const { selectedThumb } = this.restorePageState(currentState);

		if (!selectedThumb) {
			const initiallySelected = this.options.defaultSelect === "center" ? this.getCenterish() : 0;
			this.selectThumbnail(initiallySelected);
		}

		gallery.addEventListener("click", (e) => {
			const thumbnail = pointerEventPathContainsMatching(e, ".gdtl,.gl1t,tr:has(.gl1e,.gl2e)")
			if (thumbnail) {
				const targeting_a = pointerEventPathContainsMatching(e, "a");
				if (!targeting_a) return;
				const hrefType = pageType(targeting_a.href);
				if (hrefType !== "gallery" && hrefType !== "view") return
				e.preventDefault();
				this.selectThumbnail(thumbnail);
				zyX(this).delay("click", 70, () => window.location = this.highlight.highlightedHref());
			}
		}, { capture: true });

	}

	renderHeaderNav() {
		this.ExHence.header.right_container.innerHTML = "";
		html`
			<div class="HeaderNav">
				<a available="${this.navUrls.first && "true"}" zyx-click="${_ => this.navigateTo("first")}"><div>&lt&lt</div></a>			
				<a available="${this.navUrls.prev && "true"}" zyx-click="${_ => this.navigateTo("prev")}"><div>&lt</div></a>
				<a available="${this.navUrls.next && "true"}" zyx-click="${_ => this.navigateTo("next")}"><div>&gt</div></a>
				<a available="${this.navUrls.last && "true"}" zyx-click="${_ => this.navigateTo("last")}"><div>&gt&gt</div></a>
			</div>
		`.appendTo(this.ExHence.header.right_container);
	}

	getCenterish() {
		const columnCount = this.calculateColumns();
		const centerish = Math.floor(columnCount / 2)
		return columnCount % 2 ? centerish : centerish - 1;
	}

	readNavBar() {
		const galleryNavBar = [...document.querySelectorAll("#ufirst,#uprev,#unext,#ulast")];
		if (galleryNavBar.length) {
			this.navUrls = galleryNavBar.reduce((acc, node) => {
				acc[node.id.slice(1)] = node.href;
				return acc;
			}, {});
			this.ExHence.logging.debug("[ExGallery.readNavBar] Read gallery nav bar", this.navUrls);
		} else {
			const comicNavBar = [...document.querySelectorAll("table.ptt>tbody>tr>td")];
			this.navUrls.first = comicNavBar[1].firstChild?.href;
			this.navUrls.prev = comicNavBar[0].firstChild?.href;
			this.navUrls.next = comicNavBar[comicNavBar.length - 1].firstChild?.href;
			this.navUrls.last = comicNavBar[comicNavBar.length - 2].firstChild?.href;
			this.ExHence.logging.debug("[ExGallery.readNavBar] Read comic nav bar", this.navUrls);
		}
	}

	restorePageState(state) {
		if (!state.selectedThumb) return false;
		const selectedThumb = this.getGalleryNodes().find(
			(node) => node.querySelector("a").href === state.selectedThumb
		);
		if (selectedThumb) this.selectThumbnail(selectedThumb);
		return { selectedThumb };
	}

	getGalleryNodes() {
		return [...this.container.childNodes].filter((_) => _.childNodes.length > 0);
	}

	calculateColumns() {
		return Math.floor(this.container.clientWidth / this.container.firstChild.clientWidth);
	}

	selectThumbnail(nodeOrIndex) {
		if (typeof nodeOrIndex === "number") {
			const nodes = this.getGalleryNodes();
			if (nodeOrIndex < 0) nodeOrIndex = nodes.length + nodeOrIndex;
			nodeOrIndex = nodes[Math.min(Math.max(nodeOrIndex, 0), nodes.length - 1)];
		}
		if (!nodeOrIndex) return false;
		this.highlight.select(nodeOrIndex);
		this.highlight.boundsCheck();
		this.ExHence.state.galleryHistory[0].selectedThumb = this.highlight.highlightedHref();
		this.ExHence.saveState();
	}

	moveHighlight(e) {
		const collums = this.calculateColumns();
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
					if (this.options.bttmOut === "next" && this.navigateTo("next"))
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
						if (this.options.pageNav === "first/last" && this.navigateTo("prev"))
							return;
					}
					if (this.options.pageNav === "sides" && this.navigateTo("prev")) return;
				}
				break;
			case "KeyD": // RIGHT
			case "ArrowRight":
				nodeIndex++;
				if (nodeIndex % collums === 0) {
					// ALREADY ON LAST COLUMN
					if (nodeIndex === nodes.length) {
						// OUT OF BOUNDS, (AFTER LAST THUMBNAIL)
						if (this.options.pageNav === "first/last" && this.navigateTo("next"))
							return;
					}
					if (this.options.pageNav === "sides" && this.navigateTo("next")) return;
				}
				break;
		}
		this.selectThumbnail(nodeIndex);
	}

	navigateTo(direction) {
		const goto = this.navUrls[direction];
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

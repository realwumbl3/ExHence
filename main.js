console.log("oM", oM);

function observeFor(element, func, suicide) {
	"use strict";
	try {
		let observer = new MutationObserver((mutationsList) => {
			for (var mutation of mutationsList)
				if (mutation.type === "childList") {
					for (let node of mutation.addedNodes) {
						if (
							(typeof node?.querySelectorAll === "function" && node.querySelectorAll(element).length > 0) ||
							(typeof node?.matches === "function" && node.matches(element))
						) {
							func(node);
							if (suicide) observer.disconnect();
						}
					}
				}
		});
		observer.observe(document, { childList: true, subtree: true });
	} catch (err) {
		console.log("err.message: " + err.message);
	}
}

/*

    ❌ TODO ✅

    - State per tab

    ✔ Read navbar on gallery init

    ✔ Init thumbnail focus is first in view

    - First row + Last row prev/next page 
    
    - Highlight from F/Lrow navigation on same row

*/

class exHentaiCtrl {
	constructor() {
		this.gallery = {
			container: null,
			columns: null,
			ready: false,
			prev: null,
			next: null,
		};
		this.thumbnail = {
			active: null,
		};
		this.options = {
			autoScrollPadding: 20,
			firstLastColumnPageNav: true,
		};
		this.state = {
			index: 0,
			thisPage: null,
			lastPage: null,
			lastGallery: [],
		};
		this.attachHeader();
		this.bind();
		this.loadState();
	}

	saveState = () => {
		this.state.lastGallery = this.state.lastGallery.splice(-20);
		chrome.storage.local.set({ state: this.state }, () => {
			console.log("saved state ", this.state);
		});
	};

	loadState = () => {
		chrome.storage.local.get(["state"], (result) => {
			if (!result.state) return console.log("no init state set yet");
			console.log("restored state ", result.state);
			this.state = result.state;
		});
	};

	loaded = () => {
		console.log("Page Loaded! 😊");
		setTimeout((_) => this.initPage(), 100);
	};

	initPage = ({ target = null } = {}) => {
		const path = window.location.href.split(window.location.origin)[1];
		console.log("path", path);

		if (this.state.thisPage) this.state.lastPage = this.state.thisPage;

		this.state.thisPage = path;

		if ((target = document.querySelector("#gdt, .itg.gld"))) {
			this.initGalleryView(target);
			this.state.lastGallery = this.state.lastGallery.filter((_) => _ !== this.state.thisPage);
			this.state.lastGallery.push(path);
			this.saveState();
		}

		if ((target = document.querySelector(".sni"))) {
			this.enableVIEW(target);
		}
	};

	attachHeader = () => {
		observeFor(
			"#nb",
			(_) => {
				oM()(
					html`
						<div><a class="nbw" href="">exHentai-CTRL Options</a></div>
					`
				).appendTo(_);
			},
			true
		);
	};

	bind = () => {
		window.addEventListener("keydown", this.keydown);
	};

	enableVIEW = () => {
		this.gallery.ready = true;
	};

	initGalleryView = (target) => {
		this.gallery.container = target;
		this.readNavBar();
		this.getGalleryNodes();
		const firstThumbnail = firstInView(this.gallery.nodes);
		// remember selected thumbnail for each gallery
		this.selectThumbnail(firstThumbnail);
		this.gallery.ready = true;
	};

	readNavBar() {
		const navBar = document.querySelector(".ptt tr");
		this.gallery.prev = navBar.firstChild.firstChild?.href;
		this.gallery.next = navBar.lastChild.firstChild?.href;
		// .ptds <- active page
		// .ptdd <- unavailable
	}

	getGalleryNodes = () => {
		this.gallery.nodes = [...this.gallery.container.childNodes].filter((_) => _.childNodes.length > 0);
	};

	calculateGrid = () => {
		this.gallery.columns = Math.floor(this.gallery.container.clientWidth / this.thumbnail.active.clientWidth);
	};

	selectThumbnail = (node) => {
		this.thumbnail.active?.classList.remove("highlighted-thumb");
		this.thumbnail.active = node;
		this.thumbnail.active.classList.add("highlighted-thumb");
		this.boundsCheck(node);
	};

	keydown = (e) => {
		if (!this.gallery.ready) return false;
		switch (e.code) {
			case "KeyE":
				// ignore if any input feild is focused
				this.pressEonThumb();
				break;
			case "KeyQ":
				this.pressQ();
				break;
			case "KeyB":
				console.log("eXHentaiCtrl");
				console.log(this);
				break;
			case "KeyW":
			case "KeyA":
			case "KeyS":
			case "KeyD":
				this.moveHighlight(e);
				break;
			default:
				break;
		}
	};

	pressEonThumb = () => {
		const thumbnailAnchor = this.thumbnail.active.querySelector("a");
		const thumbnailLink = thumbnailAnchor.href;
		this.saveState();
		window.location = thumbnailLink;
	};

	pressQ = () => {
		// if on post use V button at bottom of page.
		// if on gallery, first and last thumbnail navigate pages and Q returns to last gallery

		if (this.state.lastGallery.length > 0) {
			for (let historyUrl of this.state.lastGallery.reverse()) {
				if (historyUrl !== this.state.thisPage) {
					this.state.lastGallery = removeFrom(this.state.lastGallery, historyUrl);
					this.saveState();
					window.location = historyUrl;
					return;
				}
			}
		}
	};

	pressAonFirst = () => {
		console.log("pressAonFirst");
		if (this.options.firstLastColumnPageNav && this.gallery.prev) {
			this.gallery.ready = false;
			window.location = this.gallery.prev;
			return true;
		}
		return false;
	};

	pressDonLast = () => {
		console.log("pressDonLast");
		if (this.options.firstLastColumnPageNav && this.gallery.next) {
			this.gallery.ready = false;
			window.location = this.gallery.next;
			return true;
		}
		return false;
	};

	moveHighlight = (e, { next } = {}) => {
		this.calculateGrid();
		const nodeIndex = this.gallery.nodes.indexOf(this.thumbnail.active);
		console.log("columns", this.gallery.columns, "nodeIndex", nodeIndex);
		switch (e.code) {
			case "KeyW":
				if (nodeIndex < this.gallery.columns) {
					// ALREADY ON FIRST ROW
					window.scrollTo(0, 0);
					break;
				}
				next = this.gallery.nodes[nodeIndex - this.gallery.columns];
				break;
			case "KeyA":
				if (nodeIndex === 0 || nodeIndex % this.gallery.columns === 0) {
					if (this.pressAonFirst()) return;
				}
				if (nodeIndex <= 0) {
					// ALREADY ON FIRST THUMBNAIL
					break;
				}
				next = this.gallery.nodes[nodeIndex - 1];
				break;
			case "KeyS":
				if (nodeIndex > this.gallery.nodes.length - this.gallery.columns - 1) {
					// ALREADY ON LAST ROW
					next = this.gallery.nodes[this.gallery.nodes.length - 1];
					break;
				}
				next = this.gallery.nodes[nodeIndex + this.gallery.columns];
				break;
			case "KeyD":
				if (nodeIndex > 0 && (nodeIndex + 1) % this.gallery.columns === 0) {
					if (this.pressDonLast()) return;
				}
				if (nodeIndex >= this.gallery.nodes.length - 1) {
					break;
				}
				next = this.gallery.nodes[nodeIndex + 1];
				break;
		}
		if (next) this.selectThumbnail(next);
		console.log("post, nodeIndex", this.gallery.nodes.indexOf(this.thumbnail.active));
	};

	boundsCheck = (node) => {
		const nodeBounds = node.getBoundingClientRect();
		let initScroll = window.scrollY;
		switch (true) {
			case nodeBounds.top < 0:
				initScroll += nodeBounds.top - this.options.autoScrollPadding;
				break;
			case nodeBounds.bottom > window.innerHeight:
				initScroll += nodeBounds.bottom - window.innerHeight + this.options.autoScrollPadding;
				break;
		}
		window.scrollTo(0, initScroll);
	};
}

function firstInView(nodes) {
	for (const node of nodes) {
		if (node.getBoundingClientRect().top >= 0) {
			return node;
		}
	}
	return false;
}

function removeFrom(inArray, item) {
	console.log("remove", item, "from", inArray);
	inArray.splice(inArray.indexOf(item), 1);
	return inArray;
}

const eXHentaiCtrl = new exHentaiCtrl();

window.addEventListener("load", eXHentaiCtrl.initPage);

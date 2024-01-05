const eXHentaiCtrl = new (class exHentaiCtrl {
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

		window.addEventListener("keydown", this.keydown.bind(this));

		this.loadState();
		chrome.runtime.sendMessage({ ping: "ping" }, (response) => {
			console.log(response.pong);
		});
	}

	saveState() {
		this.state.lastGallery = this.state.lastGallery.splice(-20);
		chrome.storage.local.set({ state: this.state }, () => {
			console.log("saved state ", this.state);
		});
	};

	async loadState() {
		chrome.storage.local.get(["state"], (result) => {
			if (!result.state) return console.log("no init state set yet");
			console.log("restored state ", result.state);
			this.state = result.state;
		});
	};

	initPage() {
		const path = window.location.href.split(window.location.origin)[1];
		let target = null;
		if ((target = document.querySelector("#gdt, .itg.gld"))) {
			this.initGalleryView(target);
			this.state.lastGallery = this.state.lastGallery.filter((_) => _ !== this.state.thisPage);
			this.state.lastGallery.push(path);
			this.saveState();
		} else if ((target = document.querySelector(".sni"))) {
			this.enableVIEW(target);
		}
	};

	attachHeader() {
		observe(
			document,
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

	enableVIEW() {
		this.gallery.ready = true;
	};

	initGalleryView(target) {
		console.log("initGalleryView", target);
		this.gallery.container = target;
		this.readNavBar();
		this.getGalleryNodes();
		const firstThumbnail = firstInView(this.gallery.nodes);
		// remember selected thumbnail for each gallery
		this.selectThumbnail(firstThumbnail);
		this.gallery.ready = true;
	};

	readNavBar() {
		const navBar = [...document.querySelectorAll("#uprev,#unext")]
		console.log("navBar", navBar);
		this.gallery.prev = navBar[0]?.href;
		this.gallery.next = navBar[1]?.href;
		// .ptds <- active page
		// .ptdd <- unavailable
	}

	getGalleryNodes() {
		this.gallery.nodes = [...this.gallery.container.childNodes].filter((_) => _.childNodes.length > 0);
	};

	calculateGrid() {
		this.gallery.columns = Math.floor(this.gallery.container.clientWidth / this.thumbnail.active.clientWidth);
	};

	selectThumbnail(node) {
		this.thumbnail.active?.classList.remove("highlighted-thumb");
		this.thumbnail.active = node;
		this.thumbnail.active.classList.add("highlighted-thumb");
		this.boundsCheck(node);
	};

	keydown(e) {
		if (document.body.querySelector("input:focus")) return; // ignore if any input feild is focused
		if (!this.gallery.ready) return false;
		switch (e.code) {
			case "KeyE":
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
			case "ArrowUp":
			case "ArrowLeft":
			case "ArrowDown":
			case "ArrowRight":
				this.moveHighlight(e);
				break;
			default:
				break;
		}
	};

	moveHighlight(e) {
		this.calculateGrid();
		let nodeIndex = this.gallery.nodes.indexOf(this.thumbnail.active);
		// console.log("columns", this.gallery.columns, "nodeIndex", nodeIndex);
		switch (e.code) {
			case "KeyW": // UP
			case "ArrowUp":
				if (nodeIndex < this.gallery.columns) {
					// ALREADY ON FIRST THUMBNAIL
					window.scrollTo(0, 0);
					break;
				}
				nodeIndex -= this.gallery.columns;
				break;
			case "KeyS": // DOWN
			case "ArrowDown":
				if (nodeIndex > this.gallery.nodes.length - this.gallery.columns - 1) {
					// ALREADY ON LAST ROW
					next = this.gallery.nodes[this.gallery.nodes.length - 1];
					break;
				}
				nodeIndex += this.gallery.columns;
				break;
			case "KeyA": // LEFT
			case "ArrowLeft":
				if (nodeIndex === 0 || nodeIndex % this.gallery.columns === 0) {
					// ALREADY ON FIRST COLUMN

					if (this.pressAonFirst()) return;
				}
				if (nodeIndex <= 0) {
					// ALREADY ON FIRST THUMBNAIL
					break;
				}
				nodeIndex--;
				break;
			case "KeyD": // RIGHT
			case "ArrowRight":
				if (nodeIndex > 0 && (nodeIndex + 1) % this.gallery.columns === 0) {
					// ALREADY ON LAST COLUMN
					if (this.pressDonLast()) return;
				}
				if (nodeIndex >= this.gallery.nodes.length - 1) {
					// ALREADY ON LAST THUMBNAIL
					break;
				}
				nodeIndex++;
				break;
		}
		this.selectThumbnail(this.gallery.nodes[nodeIndex]);
		// console.log("post, nodeIndex", this.gallery.nodes.indexOf(this.thumbnail.active));
	};

	pressEonThumb() {
		const thumbnailAnchor = this.thumbnail.active.querySelector("a");
		const thumbnailLink = thumbnailAnchor.href;
		this.saveState();
		window.location = thumbnailLink;
	};

	pressQ() {
		// if on post use V button at bottom of page.
		// if on gallery, first and last thumbnail navigate pages and Q returns to last gallery

		if (this.state.lastGallery.length > 0) {
			for (const historyUrl of this.state.lastGallery.reverse()) {
				if (historyUrl !== this.state.thisPage) {
					this.state.lastGallery.splice(this.state.lastGallery.indexOf(historyUrl), 1);
					this.saveState();
					window.location = historyUrl;
					return;
				}
			}
		}
	};

	pressAonFirst() {
		console.log("pressAonFirst");
		if (this.options.firstLastColumnPageNav && this.gallery.prev) {
			this.gallery.ready = false;
			window.location = this.gallery.prev;
			return true;
		}
		return false;
	};

	pressDonLast() {
		console.log("pressDonLast");
		if (this.options.firstLastColumnPageNav && this.gallery.next) {
			this.gallery.ready = false;
			window.location = this.gallery.next;
			return true;
		}
		return false;
	};

	boundsCheck(node) {
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
})()

window.addEventListener("load", _ => eXHentaiCtrl.initPage());

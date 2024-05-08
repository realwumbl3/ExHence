new (class exHentaiCtrl {
	constructor() {
		this.active = false
		this.gallery = {
			container: null,
			columns: null,
			prev: null,
			next: null,
			nodes: []
		};
		this.thumbnail = {
			active: null,
		};
		this.options = {
			autoScrollPadding: 20,
			firstLastColumnPageNav: true,
		};
		this.state = {
			thisPage: null,
			galleryHistory: [],
		};
		this.thisTabID = null;
		window.addEventListener("keydown", this.keydown.bind(this));
		observe(document, "#nb", this.attachHeader.bind(this))
		observe(document, "#gdt, .itg.gld", this.initGallery.bind(this))
		observe(document, ".sni", this.initView.bind(this))
	}

	async getTabID() {
		return new Promise((res, rej) => {
			chrome.runtime.sendMessage("getTab", (response) => {
				if (!response.hasOwnProperty("id")) return console.error("[ExHentaiCTRL] | No tab id response from background worker.");
				res(response.id)
			});
		});
	}

	async loadTab(thisTabID) {
		return new Promise((res, rej) => {
			this.thisTabID = thisTabID;
			const stateId = `${this.thisTabID}-state`
			chrome.storage.local.get([stateId], (result) => {
				if (!result[stateId]) {
					console.log("No init state set yet.");
					return res(true)
				}
				this.state = result[stateId]
				console.log("[ExHentaiCTRL] | restored state ", this.state);
				res(true)
			});
		})
	};

	async initGallery(gallery) {
		const tabId = await this.getTabID();
		await this.loadTab(tabId);
		const path = window.location.href.split(window.location.origin)[1];
		this.state.thisPage = path;

		if (this.state.galleryHistory.length === 0 || this.state.galleryHistory[0].path !== path) {
			this.state.galleryHistory.unshift({ path: path })
			this.saveState();
		}

		console.log("[ExHentaiCTRL] | initGalleryView", gallery);
		this.gallery.container = gallery;
		this.readNavBar();
		this.getGalleryNodes();

		if (this.state.galleryHistory[0].path === path) {
			this.restorePageState(this.state.galleryHistory[0])
		}

		this.selectThumbnail(this.thumbnail.active || firstInView(this.gallery.nodes));
		this.active = true;
	};

	restorePageState(state) {
		const lastThumbnailHref = state.selectedThumb
		const selectedThumb = this.gallery.nodes.find(_ => _.firstChild.href === lastThumbnailHref)
		this.thumbnail.active = selectedThumb
	}

	async initView(view) {
		const tabId = await this.getTabID();
		await this.loadTab(tabId);
		this.enableVIEW(view);
	}

	saveState() {
		this.state.galleryHistory = this.state.galleryHistory.splice(0, 20);
		chrome.storage.local.set({ [`${this.thisTabID}-state`]: this.state }, () => {
			console.log("[ExHentaiCTRL] | saved state ", this.state);
		});
	};

	attachHeader(exheader) {
		zyX.html`
				<div><a class="nbw" href="">exHentai-CTRL Options</a></div>
				<div><span this=log class="nbw">Log Extension.</span></div>
				<div><span this=cleartab class="nbw">Clear Tab State.</span></div>
		`
			.appendTo(exheader)
			.pass(({ log, cleartab }) => {
				log.addEventListener("click", (e) => {
					console.log("[ExHentaiCTRL] | this ", this);
				})
				cleartab.addEventListener("click", (e) => {
					this.state = {
						thisPage: null,
						galleryHistory: [],
					};
					this.saveState()
				})
			})
	};

	enableVIEW() {
		this.active = true;
	};

	readNavBar() {
		const galleryNavBar = [...document.querySelectorAll("#uprev,#unext")]
		if (galleryNavBar.length === 2) {
			console.log("[ExHentaiCTRL] | read gallery navBar");
			this.gallery.prev = galleryNavBar[0]?.href;
			this.gallery.next = galleryNavBar[1]?.href;
		}
		else {
			console.log("[ExHentaiCTRL] | read post pages navBar")
			const comicNavBar = [...document.querySelectorAll("table.ptt>tbody>tr>td")]
			this.gallery.prev = comicNavBar[0].firstChild?.href;
			this.gallery.next = comicNavBar[comicNavBar.length - 1].firstChild?.href;
		}
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
		this.state.galleryHistory[0].selectedThumb = node.firstChild.href;
		this.saveState();
	};

	keydown(e) {
		if (document.body.querySelector("input:focus")) return; // ignore if any input feild is focused
		switch (e.code) {
			case "KeyE":
				this.pressEonThumb();
				break;
			case "KeyQ":
				this.pressQ();
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
		if (!this.active) return false;
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
					break;
				}
				nodeIndex += this.gallery.columns;
				break;
			case "KeyA": // LEFT
			case "ArrowLeft":
				if (nodeIndex === 0 || nodeIndex % this.gallery.columns === 0) {
					// ALREADY ON FIRST COLUMN OR FIRST THUMBNAIL
					if (this.pressAonFirst()) return;
				}
				nodeIndex--;
				break;
			case "KeyD": // RIGHT
			case "ArrowRight":
				if ((nodeIndex + 1) % this.gallery.columns === 0
					|| nodeIndex === this.gallery.nodes.length - 1
				) {
					// ALREADY ON LAST COLUMN OR LAST THUMBNAIL
					if (this.pressDonLast()) return;
				}
				nodeIndex++;
				break;
		}
		const targetThumb = this.gallery.nodes[nodeIndex]
		if (targetThumb) this.selectThumbnail(targetThumb);
	};

	pressEonThumb() {
		const thumbnailAnchor = this.thumbnail.active.querySelector("a");
		const thumbnailLink = thumbnailAnchor.href;
		// this.saveState();
		window.location = thumbnailLink;
	};

	pressQ() {
		if (!this.active) return
		if (this.state.galleryHistory.length > 0) {
			const previous = this.state.galleryHistory.find(_ => _.path !== this.state.thisPage)
			if (!previous) return console.warn("no history to return to")
			this.state.galleryHistory = this.state.galleryHistory.splice(this.state.galleryHistory.indexOf(previous))
			this.saveState();
			console.log("going to", previous)
			this.active = false // set to false so you don't interrupt the page change with another page change		
			window.location = previous.path
			return;
		}
	};

	pressAonFirst() {
		console.log("key(Left) on first thumb")
		if (this.options.firstLastColumnPageNav && this.gallery.prev) {
			this.active = false // set to false so you don't interrupt the page change with another page change		
			window.location = this.gallery.prev;
			return true;
		}
		return false;
	};

	pressDonLast() {
		console.log("key(Right) on last thumb")
		if (this.options.firstLastColumnPageNav && this.gallery.next) {
			this.active = false // set to false so you don't interrupt the page change with another page change		
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

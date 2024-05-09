new (class exHentaiCtrl {
	constructor() {
		this.verbose = false;
		this.active = null // "view" / "gallery"
		this.gallery = {
			container: null,
			columns: null,
			prev: null,
			next: null,
		};
		this.view = {
			downloadUrl: null,
			container: null,
		}
		this.thumbnail = {
			active: null,
		};
		this.options = {
			autoScrollPadding: 20,
			firstLastColumnPageNav: true,
			bottomingOut: "nothing"
		};
		this.state = {
			thisPage: null,
			galleryHistory: [],
		};
		this.thisTabID = null;
		this.cooledDownStart = true;
		setTimeout(() => (this.cooledDownStart = false), 200)
		this.keyTimeout = new zyX.timeoutLimiter(90);
		window.addEventListener("keydown", this.keydown.bind(this));
		observe(document, "#nb", this.attachHeader.bind(this))
		observe(document, "#gdt, .itg.gld, .itg.glte", this.initGallery.bind(this))
		observe(document, ".sni", this.initView.bind(this))
	}

	logSelf() {
		console.log("[ExHentaiCTRL] | this ", this);
	}

	async loadOptions() {
		return new Promise((res, rej) => {
			chrome.storage.local.get(["ExHentaiCTRL"], async (result) => {
				if (!result.hasOwnProperty("ExHentaiCTRL")) {
					this.verbose && console.log("[ExHentaiCTRL] | No options set yet.");
					this.saveOptions();
					return res(true)
				}
				this.options = result["ExHentaiCTRL"];
				this.verbose && console.log("[ExHentaiCTRL] | loaded options ", this.options);
				res(true)
			});
		})
	}

	saveOptions() {
		chrome.storage.local.set({ "ExHentaiCTRL": this.options }, () => {
			this.verbose && console.log("[ExHentaiCTRL] | saved options ", this.options);
		});
	}

	async getTabID() {
		return new Promise((res, rej) => {
			chrome.runtime.sendMessage("getTab", (response) => {
				if (!response.hasOwnProperty("id")) return console.error("[ExHentaiCTRL] | No tab id response from background worker.");
				res(response.id)
			});
		});
	}

	async loadTab() {
		await this.loadOptions();
		const tabId = await this.getTabID();
		this.thisTabID = tabId;
		return new Promise((res, rej) => {
			const stateId = `${this.thisTabID}-state`
			chrome.storage.local.get([stateId], (result) => {
				if (!result[stateId]) {
					this.verbose && console.log("No init state set yet.");
					return res(true)
				}
				this.state = result[stateId]
				this.verbose && console.log("[ExHentaiCTRL] | restored state ", this.state);
				res(true)
			});
		})
	};

	async initGallery(gallery) {
		if (gallery.matches(".itg.glte")) { // Extended view nodes are wrapped in a table container.
			gallery = gallery.firstChild
		}

		await this.loadTab();

		const path = window.location.href.split(window.location.origin)[1];
		this.state.thisPage = path;

		if (this.state.galleryHistory.length === 0 || this.state.galleryHistory[0].path !== path) {
			this.state.galleryHistory.unshift({ path: path })
			this.saveState();
		}

		this.verbose && console.log("[ExHentaiCTRL] | initGalleryView", gallery);
		this.gallery.container = gallery;
		this.readNavBar();
		const nodes = this.getGalleryNodes();

		if (this.state.galleryHistory[0].path === path) {
			this.restorePageState(this.state.galleryHistory[0])
		}

		this.selectThumbnail(this.thumbnail.active || firstInView(nodes));
		this.active = "gallery";
	};

	restorePageState(state) {
		const nodes = this.getGalleryNodes();
		const lastThumbnailHref = state.selectedThumb
		const selectedThumb = nodes.find(node => node.querySelector("a").href === lastThumbnailHref)
		this.thumbnail.active = selectedThumb
	}

	async initView(view) {
		await this.loadTab();
		this.view.container = view;
		this.active = "view";
	}

	saveState() {
		this.state.galleryHistory = this.state.galleryHistory.splice(0, 200);
		chrome.storage.local.set({ [`${this.thisTabID}-state`]: this.state }, () => {
			this.verbose && console.log("[ExHentaiCTRL] | saved state ", this.state);
		});
	};

	attachHeader(exheader) {
		zyX.html`
				<div><span this=opts class="nbw custom">exHentai-CTRL Options</span></div>
				<div><span this=help class="nbw custom">Show Hotkeys</span></div>
				<div><span this=log class="nbw custom">Log</span></div>
				<div><span this=cleartab class="nbw custom">Clear State.</span></div>
		`
			.appendTo(exheader)
			.pass(({ opts, log, cleartab }) => {
				opts.addEventListener("click", (e) => {
					this.showOptions()
				})
				log.addEventListener("click", (e) => this.logSelf())
				cleartab.addEventListener("click", (e) => {
					this.state = {
						thisPage: null,
						galleryHistory: [{ path: window.location.href.split(window.location.origin)[1] }]
					};
					this.saveState()
				})
			})

	};

	showOptions() {
		[...document.body.querySelectorAll(".ExHentaiCTRL-Options")].forEach(_ => _.remove());
		zyX.html`
				<div this=menu class=ExHentaiCTRL-Options>
					<span class=Header>
						<div class=Title>ExHentai-CTRL</div><div this=close class=Close>X</div>
					</span>
					<div class=Options>
						<div class=Opt title="What to do when you reach the bottom of the posts and keep going.">
							<div>Bottoming out: </div><div this=bottomout class=Toggle>${this.options.bottomingOut}</div>
						</div>
					</table>
				</div>
		`
			.appendTo(document.body)
			.pass(({ menu, bottomout, close }) => {
				bottomout.addEventListener("click", (e) => {
					this.options.bottomingOut = this.options.bottomingOut === "nothing" ? "next page" : "nothing";
					this.saveOptions();
					bottomout.textContent = this.options.bottomingOut;
				})
				close.addEventListener("click", (e) => menu.remove());
			})
	};

	readNavBar() {
		const galleryNavBar = [...document.querySelectorAll("#uprev,#unext")]
		if (galleryNavBar.length === 2) {
			this.verbose && console.log("[ExHentaiCTRL] | read gallery navBar");
			this.gallery.prev = galleryNavBar[0]?.href;
			this.gallery.next = galleryNavBar[1]?.href;
		}
		else {
			this.verbose && console.log("[ExHentaiCTRL] | read post pages navBar")
			const comicNavBar = [...document.querySelectorAll("table.ptt>tbody>tr>td")]
			this.gallery.prev = comicNavBar[0].firstChild?.href;
			this.gallery.next = comicNavBar[comicNavBar.length - 1].firstChild?.href;
		}
	}

	getGalleryNodes() {
		return [...this.gallery.container.childNodes].filter((_) => _.childNodes.length > 0);
	};

	calculateGrid() {
		return Math.floor(this.gallery.container.clientWidth / this.thumbnail.active.clientWidth);
	};

	selectThumbnail(node) {
		if (!node) return false;
		this.thumbnail.active?.classList.remove("highlighted-thumb");
		this.thumbnail.active = node;
		this.thumbnail.active.classList.add("highlighted-thumb");
		this.boundsCheck(node);
		const selectedHref = node.querySelector("a").href
		this.state.galleryHistory[0].selectedThumb = selectedHref
		this.saveState();
	};

	keydown(e) {
		if (document.body.querySelector("input:focus, textarea:focus")) return; // ignore if any input feild is focused\
		if (!this.keyTimeout() || this.cooledDownStart) return;
		switch (e.code) {
			case "KeyE":
				if (this.active === "gallery") return this.pressEonThumb();
				else if (this.active === "view") return this.downloadView();
				break;
			case "KeyQ":
				this.pressQ();
				break;
			case "KeyL":
				this.logSelf();
				break;
			case "KeyE":
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
		const collums = this.calculateGrid();
		const nodes = this.getGalleryNodes();
		let nodeIndex = nodes.indexOf(this.thumbnail.active);
		switch (e.code) {
			case "KeyW": // UP
			case "ArrowUp":
				if (nodeIndex < collums) {
					// ALREADY ON FIRST THUMBNAIL ROW
					window.scrollTo(0, 0);
					break;
				}
				nodeIndex -= collums;
				break;
			case "KeyS": // DOWN
			case "ArrowDown":
				if (nodeIndex > nodes.length - collums - 1) {
					// ALREADY ON LAST THUMBNAIL ROW
					if (this.options.bottomingOut === "next page" && this.navigateTo("next")) return;
				}
				nodeIndex += collums;
				break;
			case "KeyA": // LEFT
			case "ArrowLeft":
				if (nodeIndex === 0 || nodeIndex % collums === 0) {
					// ALREADY ON FIRST COLUMN OR FIRST THUMBNAIL
					if (this.navigateTo("prev")) return;
				}
				nodeIndex--;
				break;
			case "KeyD": // RIGHT
			case "ArrowRight":
				if ((nodeIndex + 1) % collums === 0 || nodeIndex === nodes.length - 1) {
					// ALREADY ON LAST COLUMN OR LAST THUMBNAIL
					if (this.navigateTo("next")) return;
				}
				nodeIndex++;
				break;
		}
		this.selectThumbnail(nodes[nodeIndex]);
	};

	pressEonThumb() {
		const thumbnailAnchor = this.thumbnail.active.querySelector("a");
		window.location = thumbnailAnchor.href;
	};

	getViewDownload() {
		const downloadButton = this.view.container.querySelector("#i6").lastChild.querySelector("a").href
		if (downloadButton.startsWith("https://exhentai.org/fullimg/")) return downloadButton
		const viewImage = this.view.container.querySelector("#img").src
		if (viewImage) return viewImage
		console.error("[ExHentaiCTRL] | No download link found.")
	}

	async downloadView() {
		const viewDownload = this.getViewDownload()
		this.verbose && console.log("[ExHentaiCTRL] | downloadView", viewDownload)
		chrome.runtime.sendMessage({ func: "chrome.downloads.download", url: viewDownload })
	}

	pressQ() {
		if (!this.active) return
		if (this.state.galleryHistory.length > 0) {
			const previous = this.state.galleryHistory.find(_ => _.path !== this.state.thisPage)
			if (!previous) return false
			this.state.galleryHistory = this.state.galleryHistory.splice(this.state.galleryHistory.indexOf(previous))
			this.saveState();
			this.verbose && console.log("going to", previous)
			this.active = null // set to false so you don't interrupt the page change with another page change		
			window.location = previous.path
			return;
		}
	};

	navigateTo(direction) {
		if (!this.options.firstLastColumnPageNav) return false;
		const goto = direction === "prev" ? this.gallery.prev : this.gallery.next;
		if (!goto) return false;
		this.active = null // set to false so you don't interrupt the page change with another page change
		window.location = goto;
		return true;
	}

	boundsCheck(node) {
		const nodeBounds = node.getBoundingClientRect();
		switch (true) {
			case nodeBounds.top < 0:
				window.scrollTo(0, window.scrollY + nodeBounds.top - this.options.autoScrollPadding);
				break;
			case nodeBounds.bottom > window.innerHeight:
				window.scrollTo(0, window.scrollY + nodeBounds.bottom - window.innerHeight + this.options.autoScrollPadding);
				break;
		}
	};
})()


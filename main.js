new (class exHentaiCtrl {
	constructor() {
		this.verbose = false;
		this.active = null // "view" / "gallery"
		this.gallery = {
			container: null,
			prev: null,
			next: null,
		};
		this.view = {
			container: null,
		}
		this.thumbnail = {
			active: null,
		};
		this.options = {
			autoScrollPadding: 20,
			pageNav: "sides",
			bottomingOut: "nothing"
		};
		this.state = {
			galleryHistory: [],
		};
		this.page = this.getPath();
		this.pageType = pageType(this.page);

		this.thisTabID = null;

		this.keyTimeout = new zyX.timeoutLimiter(100);

		window.addEventListener("keydown", this.keydown.bind(this));
		observe(document, "#nb", this.headerAttached.bind(this))
		observe(document, "#gdt, .itg.gld, .itg.glte", this.initGallery.bind(this))
		observe(document, ".sni", this.initView.bind(this))

		this.cooledDownStart = false; // Prevents multiple keypresses in quick succession.
		this.coolDownPause(200)
	}

	getPath() {
		return window.location.href.split(window.location.origin)[1];
	}

	forEachImg(cb) {
		for (const img of [...document.querySelectorAll("img")]) cb(img)
	}

	coolDownPause(timeout) {
		const init = this.cooledDownStart;
		this.cooledDownStart = true;
		setTimeout(() => (this.cooledDownStart = false), timeout || 200);
		return init;
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
		this.thisTabID = await this.getTabID();
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

		if (this.state.galleryHistory.length === 0 || this.state.galleryHistory[0].path !== this.page) {
			this.state.galleryHistory.unshift({ path: this.page })
			this.saveState();
		}

		const currentState = this.state.galleryHistory[0]
		const previousState = this.state.galleryHistory[1]

		// If we're in a gallery and the previous state was also a gallery, remove the previous state.
		// This is so going back from a gallery goes back to the page that led to the gallery istead of the previous gallery page.
		if (previousState && pageType(previousState.path) === "gallery" && this.pageType === "gallery") {
			console.log("removing previous gallery state")
			this.state.galleryHistory.splice(1, 1)
			this.saveState();
		}

		this.verbose && console.log("[ExHentaiCTRL] | initGalleryView", gallery);
		this.gallery.container = gallery;
		this.readNavBar();
		const nodes = this.getGalleryNodes();

		if (currentState.path === this.page) {
			this.restorePageState(currentState)
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

	clearState() {
		this.state = {
			thisPage: null,
			galleryHistory: [{ path: window.location.href.split(window.location.origin)[1] }]
		};
		this.saveState()
	}

	headerAttached(exheader) {
		zyX.html`
		<div><span this=opts class="nbw custom">exHentai-CTRL Options</span></div>
		<div><span this=help class="nbw custom">Show Hotkeys</span></div>
		<div><span this=log class="nbw custom">Log</span></div>
		<div><span this=cleartab class="nbw custom">Clear State.</span></div>
		`
			.appendTo(exheader)
			.pass(({ opts, log, cleartab, help }) => {
				opts.addEventListener("click", (e) => this.showOptions())
				log.addEventListener("click", (e) => this.logSelf())
				help.addEventListener("click", (e) => this.showHotkeys())
				cleartab.addEventListener("click", (e) => this.clearState())
			})

	};

	showOptions() {
		const bottomOutRepr = (state) => state === "nothing" ? "do nothing" : "goto next page";
		const sidesRepr = (state) => state === "sides" ? "side columns" : "first/last thumbnail";

		[...document.body.querySelectorAll(".ExHentaiCTRL-Options")].forEach(_ => _.remove());
		zyX.html`
		<div this=menu class="ExHentaiCTRL-Window ExHentaiCTRL-Options">
			<span class=Header>
				<div class=Title>ExHentai-CTRL</div><div this=close class=Close>X</div>
			</span>
			<div class=Options>
				<div class=Opt title="What to do when you reach the bottom of the posts and keep going">
					<div>Bottoming out: </div><div this=bottomout class=Toggle>${bottomOutRepr(this.options.bottomingOut)}</div>
				</div>
				<div class=Opt title="How do you want to navigate pages">
					<div>Navigates pages:</div><div this=sides class=Toggle>${sidesRepr(this.options.pageNav)}</div>
				</div>
			</div>
		</div>
		`
			.appendTo(document.body)
			.pass(({ menu, bottomout, close, sides }) => {
				bottomout.addEventListener("click", (e) => {
					this.options.bottomingOut = this.options.bottomingOut === "nothing" ? "next page" : "nothing";
					this.saveOptions();
					bottomout.textContent = bottomOutRepr(this.options.bottomingOut);
				})
				sides.addEventListener("click", (e) => {
					this.options.pageNav = this.options.pageNav === "sides" ? "first/last" : "sides";
					this.saveOptions();
					sides.textContent = sidesRepr(this.options.pageNav);
				})
				close.addEventListener("click", (e) => menu.remove());
			})
	};

	showHotkeys() {
		[...document.body.querySelectorAll(".ExHentaiCTRL-Help")].forEach(_ => _.remove());
		zyX.html`
		<div this=menu class="ExHentaiCTRL-Window ExHentaiCTRL-Help">
			<span class=Header>
				<div class=Title>ExHentai-CTRL</div><div this=close class=Close>X</div>
			</span>
			<div class=Hotkeys>
				<div class=Hotkey title="[Gallery] Navigate thumbnails/pages using these keys">
					<div this=Action>Up/Down/Left/Right navigation</div><div class=Keys>WASD/Arrows</div>
				</div>
				<div class=Hotkey title="[Gallery] Enter a thumbnail || [Post] Download the image">
					<div this=Action>Enter thumbnail/Download image</div><div class=Keys>E</div>
				</div>
				<div class=Hotkey title="[Gallery/Post] Go back to the previous gallery page">
					<div this=Action>Go back</div><div class=Keys>Q</div>
				</div>
			</div>
		</div>
		`
			.appendTo(document.body)
			.pass(({ menu, close }) => {
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
		if (!this.keyTimeout(e.code) || this.cooledDownStart) return;
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
				nodeIndex -= collums;
				if (nodeIndex < 0) { // OUT OF BOUNDS, (BELOW FIRST ROW)
					return window.scrollTo(0, 0);
				}
				break;
			case "KeyS": // DOWN
			case "ArrowDown":
				nodeIndex += collums;
				if (nodeIndex > nodes.length - 1) { // OUT OF BOUNDS, (BEYOND LAST ROW)
					if (this.options.bottomingOut === "next page" && this.navigateTo("next")) return;
				}
				break;
			case "KeyA": // LEFT
			case "ArrowLeft":
				nodeIndex--;
				if ((nodeIndex + 1) % collums === 0) { // ALREADY ON FIRST COLUMN
					if (nodeIndex === -1) { // OUT OF BOUNDS, (BEFORE FIRST THUMBNAIL)
						if (this.options.pageNav === "first/last" && this.navigateTo("prev")) return;
					}
					if (this.options.pageNav === "sides" && this.navigateTo("prev")) return;
				}
				break;
			case "KeyD": // RIGHT
			case "ArrowRight":
				nodeIndex++;
				if ((nodeIndex) % collums === 0) { // ALREADY ON LAST COLUMN
					if (nodeIndex === nodes.length) { // OUT OF BOUNDS, (AFTER LAST THUMBNAIL)
						if (this.options.pageNav === "first/last" && this.navigateTo("next")) return;
					}
					if (this.options.pageNav === "sides" && this.navigateTo("next")) return;
				}
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
		if (this.coolDownPause(1000)) return;
		this.verbose && console.log("[ExHentaiCTRL] | downloadView", viewDownload)
		chrome.runtime.sendMessage({ func: "chrome.downloads.download", url: viewDownload })
	}

	pressQ() {
		if (!this.active) return
		if (this.state.galleryHistory.length > 0) {
			const previous = this.state.galleryHistory.find(_ => _.path !== this.page)
			if (!previous) return false
			this.state.galleryHistory = this.state.galleryHistory.splice(this.state.galleryHistory.indexOf(previous))
			this.saveState();
			this.verbose && console.log("going to", previous)
			if (this.coolDownPause(1000)) return;
			window.location = previous.path
			return;
		}
	};

	navigateTo(direction) {
		const goto = direction === "prev" ? this.gallery.prev : this.gallery.next;
		if (!goto) return false;
		if (this.coolDownPause(1000)) return;
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

function pageType(url) {
	if (url.startsWith("/g/")) return "gallery";
	if (url.startsWith("/s/")) return "view";
	if (url.startsWith("/")) return "home";
	return "unknown";
}

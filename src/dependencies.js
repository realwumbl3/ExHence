export function injectScript(src) {
	const script = document.createElement("script");
	script.type = "text/javascript";
	script.src = src;
	document.body.appendChild(script);
	script.addEventListener("load", () => script.remove());
}

/**
 * 
 * @param {String} html
 * @returns {links[String], imgs[String]}
 */
export function extractImagesAndLinks(doc) {
	// Example: Extract all links from the page
	const links = [...doc.querySelectorAll('a')].map(a => a.href);
	const imgs = [...doc.querySelectorAll('img')].map(img => img.src);
	return { links, imgs };
}

// Function to fetch the full page content
export async function fetchDocument(url) {
	try {
		const response = await fetch(url);
		const html = await response.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		return { doc };
	} catch (error) {
		console.error('Error fetching the page:', error);
		return { error };
	}
}

export class ZyXImage {
	constructor({ src, mode = "img" } = {}) {
		this.mode = mode;
		this.element = document.createElement("div");
		this.element.classList.add("zyx-image");

		/* Image loading and layout calculation start */
		this.ratio = null;
		this.resizeObserver = new ResizeObserver(this.calcParentRelationRatio.bind(this));
		// create virtual image
		this.img = new Image();
		this.img.addEventListener("load", this.imgLoaded.bind(this));

		this.img.setAttribute("img-x-img", "");
		this.img.setAttribute("ondragstart", "return false");
		this.element.appendChild(this.img);

		if (src) this.src = src;
		this.resizeObserver.observe(this.element);
	}

	detach() {
		this.resizeObserver.unobserve(this.element);
		this.element.remove();
	}

	get src() {
		return this.img.src;
	}

	set src(src) {
		this.img.setAttribute("img-x-img", "");
		if (!src) return (this.img.src = "");
		this.img.src = src;
	}

	imgLoaded() {
		this.element.dispatchEvent(new CustomEvent("load"));
		this.img.setAttribute("img-x-img", "loaded");
		this.updateRatio();
	}

	updateRatio() {
		this.ratio = aspectRatio(this.img.naturalWidth, this.img.naturalHeight);
		this.element.style.setProperty("--aspect-ratio", `${this.ratio[0]}/${this.ratio[1]}`);
		this.calcParentRelationRatio();
	}

	calcParentRelationRatio() {
		try {
			if (!this.ratio) return false;
			const widerThanParent =
				this.ratio[0] / this.ratio[1] >=
				this.element.parentNode.clientWidth / this.element.parentNode.clientHeight;
			this.element.setAttribute("img-x-ratio", widerThanParent ? "wide" : "tall");
		} catch (e) {
			return false;
		}
	}
}

export const SHIFT_PAN = 0;
export const SHIFT_ZOOM = 1;

export class ZoomAndPan {
	constructor(element, {
		wheelDeterminer = (e) => (e.shiftKey ? SHIFT_ZOOM : SHIFT_PAN),
	} = {}) {
		this.element = element;
		this.animating = false;
		this.frameFraction = 4;
		this.zoomLimits = { min: 1, max: 5 };

		this.wheelDeterminer = wheelDeterminer;

		this.context = { zoomedIn: false };

		this.target = { x: 50, y: 50, zoom: 1 };
		this.current = { x: 50, y: 50, zoom: 1 };
		this.last_zoom_pos = { x: -100, y: -100 };

		this.multiTouch = {};
		this.reset();

		this.element.addEventListener("pointerdown", this.pointerDown.bind(this), {
			passive: true,
		});
		this.element.addEventListener("wheel", this.wheel.bind(this));
		this.element.addEventListener("dblclick", this.dblClick.bind(this));

		window.addEventListener("blur", this.reset.bind(this));
		window.addEventListener("mouseup", this.mouseUp.bind(this));
	}

	setParentContext(keyvalues) {
		for (const [key, value] of Object.entries(keyvalues)) {
			if (this.context[key] !== value || this.context[key] === undefined) {
				this.context[key] = value;
				this.element.classList.toggle(key, value);
			}
		}
	}

	addListeners() {
		this.element.addEventListener("pointermove", this.pointermove.bind(this));
		document.addEventListener("pointerup", this.pointerUp.bind(this));
		document.addEventListener("pointercancel", this.pointerUp.bind(this));
	}

	removeListeners() {
		this.element.removeEventListener("pointermove", this.pointermove.bind(this));
		document.removeEventListener("pointerup", this.pointerUp.bind(this));
		document.removeEventListener("pointercancel", this.pointerUp.bind(this));
	}

	destructor() {
		window.removeEventListener("mouseup", this.mouseUp.bind(this));
		window.removeEventListener("blur", this.reset.bind(this));
		this.removeListeners();
	}

	mouseUp(e) {
		if (outsideWindowBounds(e.clientX, e.clientY)) this.reset();
	}

	reset() {
		this.multiTouch.active = false;
		this.multiTouch.distance = null;
		this.multiTouch.firstE = null;
		this.multiTouch.secondE = null;
		this.multiTouch.firstId = null;
		this.multiTouch.secondId = null;
	}

	pointerDown(e) {
		if (this.multiTouch.firstId === null) {
			this.multiTouch.firstId = e.pointerId;
			this.addListeners();
		} else if (this.multiTouch.secondId === null) {
			this.multiTouch.secondId = e.pointerId;
			this.multiTouch.active = true;
		}
	}

	cancelSecondTouch() {
		this.multiTouch.active = false;
		this.multiTouch.secondId = null;
		this.multiTouch.secondE = null;
		this.multiTouch.distance = null;
	}

	pointerUp(e) {
		// if first pointer is released
		if (e.pointerId === this.multiTouch.firstId) {
			// if second pointer is not active all pointers become inactive
			if (this.multiTouch.secondId === null) {
				// first pointer released and second pointer is not active
				this.multiTouch.firstId = null;
			} else {
				// first pointer released and second pointer is active
				// set second pointer as first pointer and fall back to single pointer mode
				this.multiTouch.firstId = this.multiTouch.secondId;
				this.cancelSecondTouch();
			}
		} else if (e.pointerId === this.multiTouch.secondId) {
			// if second pointer is released (first should be active)
			this.cancelSecondTouch();
		}
		// if no pointers are active remove pointermove listener
		if (this.multiTouch.firstId === null && this.multiTouch.secondId === null) {
			this.removeListeners();
			this.reset();
		}
	}

	pointermove(e) {
		if (this.multiTouch.active) {
			if (e.pointerId === this.multiTouch.firstId) this.multiTouch.firstE = e;
			if (e.pointerId === this.multiTouch.secondId) this.multiTouch.secondE = e;
			if (this.multiTouch.secondE && this.multiTouch.firstE)
				return this.multiTouchMove(this.multiTouch.firstE, this.multiTouch.secondE);
		} else if (e.pointerId === this.multiTouch.firstId) {
			const [movementX, movementY] = [
				e.movementX / this.target.zoom,
				e.movementY / this.target.zoom,
			];
			this.updateTarget({ x: this.target.x - movementX, y: this.target.y - movementY });
		}
	}

	multiTouchMove(e1, e2) {
		this.multiTouch.firstE = null;
		this.multiTouch.secondE = null;

		const currentDistance = Math.hypot(e1.clientX - e2.clientX, e1.clientY - e2.clientY);
		if (this.multiTouch.distance !== null) {
			const distanceDiff = this.multiTouch.distance - currentDistance;
			if (Math.abs(distanceDiff) > 2) {
				this.updateTarget({ zoom: this.target.zoom - distanceDiff / 100 });
				this.multiTouch.distance = currentDistance;
			}
		} else {
			this.multiTouch.distance = currentDistance;
		}

		if (this.target.zoom < 1.1) {
			const [avgposX, avgposY] = [
				(e1.clientX + e2.clientX) / 2,
				(e1.clientY + e2.clientY) / 2,
			];
			const [screenXpercent, screenYpercent] = cursorPercentPosition(
				this.element,
				avgposX,
				avgposY
			);
			this.updateTarget({ x: nearEdge(screenXpercent), y: nearEdge(screenYpercent) });
		}

		const [avgmovX, avgmovY] = [
			(e1.movementX + e2.movementX) / 2,
			(e1.movementY + e2.movementY) / 2,
		];
		this.updateTarget({
			x: this.target.x - avgmovX / this.target.zoom,
			y: this.target.y - avgmovY / this.target.zoom,
		});
	}

	wheel(e) {
		e.preventDefault();

		if (this.wheelDeterminer(e) == SHIFT_PAN) return this.pan(e);

		if (e.deltaY < 0) {
			const [screenXpercent, screenYpercent] = cursorPercentPosition(
				this.element,
				e.clientX,
				e.clientY
			);
			const distance = Math.hypot(
				e.clientX - this.last_zoom_pos.x,
				e.clientY - this.last_zoom_pos.y
			);
			if (distance > 0.1) {
				this.updateTarget({
					x: nearEdge(screenXpercent, 5),
					y: nearEdge(screenYpercent, 5),
				});
				this.last_zoom_pos = { x: e.clientX, y: e.clientY };
			}
		}

		this.target.zoom *= Math.pow(1.001, -e.deltaY);

		this.updateTarget({ zoom: this.target.zoom });
	}

	pan(e) {
		const movementY = (e.deltaY * .3) / this.target.zoom;
		this.updateTarget({ y: this.target.y + movementY });
	}

	dblClick(e) {
		const [parentWidth, parentHeight] = this.getParentSize();
		const [width, height] = this.getRealSize();
		if (this.target.zoom > 1) return this.resetTransform();
		if (width > parentWidth || height > parentHeight) {
			this.updateTarget({ zoom: this.target.zoom * 1.75 });
			this.zoomInOnCursor(e);
		} else {
			this.fillShortSide(e);
		}
	}

	getParentSize() {
		return [this.element.parentNode.clientWidth, this.element.parentNode.clientHeight];
	}

	getRealSize() {
		return [
			this.element.clientWidth * this.target.zoom,
			this.element.clientHeight * this.target.zoom,
		];
	}

	updateTarget({ x, y, zoom } = {}) {
		x && (this.target.x = Math.max(Math.min(x, 100), 0));
		y && (this.target.y = Math.max(Math.min(y, 100), 0));
		zoom &&
			(this.target.zoom = Math.max(
				Math.min(zoom, this.zoomLimits.max),
				this.zoomLimits.min
			));
		const [width, height] = this.getRealSize();
		const [parentWidth, parentHeight] = this.getParentSize();
		width <= parentWidth && height > parentHeight && (this.target.x = 50);
		height <= parentHeight && width > parentWidth && (this.target.y = 50);
		this.setParentContext({ zoomedIn: this.target.zoom > 1 });
		this.animationLoop();
	}

	animationLoop() {
		if (this.animating || !(this.animating = true)) return;
		const frame = () => {
			this.current.x += (this.target.x - this.current.x) / this.frameFraction;
			this.current.y += (this.target.y - this.current.y) / this.frameFraction;
			this.current.zoom += (this.target.zoom - this.current.zoom) / this.frameFraction;
			this.updateTransform();
			if (this.targetAndCurrentDiff() < 0.001) {
				(this.current.x = this.target.x) ||
					(this.current.y = this.target.y) ||
					(this.current.zoom = this.target.zoom);
				this.updateTransform();
				return (this.animating = false);
			}
			requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);
	}

	targetAndCurrentDiff = () =>
		Math.abs(
			this.target.x -
			this.current.x +
			this.target.y -
			this.current.y +
			this.target.zoom -
			this.current.zoom
		);

	resetPosition = () => this.updateTarget({ x: 50, y: 50 });

	resetZoom = () => this.updateTarget({ zoom: 1 });

	resetTransform = () => this.resetPosition() || this.resetZoom();

	updateTransform() {
		this.element.style.transformOrigin = `${this.current.x}% ${this.current.y}%`;
		this.element.style.transform = `scale(${this.current.zoom})`;
	}

	zoomInOnCursor(e) {
		const [screenXpercent, screenYpercent] = cursorPercentPosition(
			this.element,
			e.clientX,
			e.clientY
		);
		this.updateTarget({ x: nearEdge(screenXpercent), y: nearEdge(screenYpercent) });
	}

	fillShortSide(e) {
		const [width, height] = this.getRealSize();
		const [parentWidth, parentHeight] = this.getParentSize();
		this.zoomInOnCursor(e);
		if (width < parentWidth) this.updateTarget({ zoom: (parentWidth - 2) / width });
		else if (height < parentHeight)
			this.updateTarget({ zoom: (parentHeight - 2) / height });
	}
}

function outsideWindowBounds(x, y) {
	return x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight;
}
function nearEdge(input, buffer) {
	return ((input - 50) / 50) * (buffer || 10) + input;
}

function cursorPercentPosition(container, x, y) {
	const rect = container.getBoundingClientRect();
	return [((x - rect.left) / rect.width) * 100, ((y - rect.top) / rect.height) * 100];
}

function common_divisor(a, b) {
	return b === 0 ? a : common_divisor(b, a % b);
}

function aspectRatio(width, height) {
	const divisor = common_divisor(width, height);
	return [width / divisor, height / divisor];
}

import zyX, { html } from "./zyX-es6.js";

import ExHentaiCtrl from "./main.js";

/**
 * @this {ExHentaiCtrl}
 */
export default function () {
	const bottomOutRepr = (state) =>
		state === "nothing" ? "do nothing" : "goto next page";
	const sidesRepr = (state) =>
		state === "sides" ? "side columns" : "first/last thumbnail";
	const defaultSelectRepr = (state) =>
		state === "center" ? "center thumbnail" : "first thumbnail";
	const viewBehaviorRepr = (state) =>
		state === "scrollZoom" ? "zoom, +shift pan" : "pan, +shift zoom";

	[...document.body.querySelectorAll(".ExHentaiCTRL-Options")].forEach((_) => _.remove());
	html`
		<div this="menu" class="ExHentaiCTRL-Window ExHentaiCTRL-Options">
			<span class="Header">
				<div class="Title">ExHentai-CTRL</div>
				<div this="close" class="Close">X</div>
			</span>
			<div class="Options">
				<div class="Opt" title="When you reach the bottom of the posts and keep going">
					<div>Bottoming out:</div>
					<div this="bottomout" class="Toggle">
						${bottomOutRepr(this.options.bttmOut)}
					</div>
				</div>

				<div class="Opt" title="How do you want to navigate pages">
					<div>Navigates pages:</div>
					<div this="sides" class="Toggle">${sidesRepr(this.options.pageNav)}</div>
				</div>

				<div class="Opt" title="What thumbnail to select by default">
					<div>Default selected:</div>
					<div this="defaultSelect" class="Toggle">${defaultSelectRepr(this.options.defaultSelect)}</div>
				</div>

				<div class="Opt" title="View image handling">
					<div>View scrolling</div>
					<div this="viewBehavior" class="Toggle">${viewBehaviorRepr(this.options.viewBehavior)}</div>
				</div>

				<div class="Opt" title="How many pixels is the thumbnail auto-scrolling padding">
					<div>Auto-scroll padding:</div>
					<input
						class="Toggle"
						this="padding"
						type="number"
						value=${this.options.autoScrollPadding}
						min="0"
						max="2000"
					/>
				</div>
			</div>
		</div>
	`
		.appendTo(document.body)
		.pass(({ menu, bottomout, close, sides, padding, defaultSelect, viewBehavior }) => {
			bottomout.addEventListener("click", (e) => {
				this.options.bttmOut =
					this.options.bttmOut === "nothing" ? "next" : "nothing";
				this.saveOptions();
				bottomout.textContent = bottomOutRepr(this.options.bttmOut);
			});
			sides.addEventListener("click", (e) => {
				this.options.pageNav = this.options.pageNav === "sides" ? "first/last" : "sides";
				this.saveOptions();
				sides.textContent = sidesRepr(this.options.pageNav);
			});
			close.addEventListener("click", (e) => menu.remove());
			padding.addEventListener("change", (e) => {
				this.options.autoScrollPadding = parseInt(padding.value);
				this.saveOptions();
			});
			defaultSelect.addEventListener("click", (e) => {
				this.options.defaultSelect = this.options.defaultSelect === "center" ? "first" : "center";
				this.saveOptions();
				defaultSelect.textContent = defaultSelectRepr(this.options.defaultSelect);
			});
			viewBehavior.addEventListener("click", (e) => {
				this.options.viewBehavior = this.options.viewBehavior === "scrollZoom" ? "panZoom" : "scrollZoom";
				this.saveOptions();
				viewBehavior.textContent = viewBehaviorRepr(this.options.viewBehavior);
			});

		});
}

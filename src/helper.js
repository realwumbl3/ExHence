import zyX, { html } from "./zyX-es6.js";

import ExHentaiCtrl from "./main.js";

/**
 * @this {ExHentaiCtrl}
 */
export default function () {
	[...document.body.querySelectorAll(".ExHentaiCTRL-Help")].forEach((_) => _.remove());
	html`
		<div this="menu" class="ExHentaiCTRL-Window ExHentaiCTRL-Help">
			<span class="Header">
				<div class="Title">ExHentai-CTRL</div>
				<div this="close" class="Close">X</div>
			</span>
			<div class="Hotkeys">
				<div class="Hotkey" title="[Gallery] Navigate posts/pages using these keys">
					<div this="Action">Up/Down/Left/Right Navigation</div>
					<div class="Keys">WASD / Arrows</div>
				</div>
				<div class="Hotkey" title="[Gallery] Navigate to the first and last">
					<div this="Action">Highlight First/Last</div>
					<div class="Keys">Home / End</div>
				</div>
				<div class="Hotkey" title="[Gallery] View a post || [Post] Download the image">
					<div this="Action">View Post/Download Image</div>
					<div class="Keys">E / Enter</div>
				</div>
				<div class="Hotkey" title="[Gallery/Post] Go back to the previous gallery page">
					<div this="Action">Go Back</div>
					<div class="Keys">Q / Backspace</div>
				</div>
				<div class="Hotkey" title="[ExHentai] Go to your ExHentai favorites">
					<div this="Action">Go To Favorites</div>
					<div class="Keys">F</div>
				</div>
				<div class="Hotkey" title="[ExHentai] Go to the ExHentai homepage">
					<div this="Action">Go Home</div>
					<div class="Keys">X</div>
				</div>
			</div>
		</div>
	`
		.appendTo(document.body)
		.pass(({ menu, close }) => {
			close.addEventListener("click", (e) => menu.remove());
		});
}

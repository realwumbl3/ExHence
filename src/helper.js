import zyX, { html } from "./zyX-es6.js";

import ExHentaiCtrl from './exhentai-ctrl.js';

/**
 * @this {ExHentaiCtrl}
 */
export default function () {
    [...document.body.querySelectorAll(".ExHentaiCTRL-Help")].forEach(_ => _.remove());
    html`
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
}
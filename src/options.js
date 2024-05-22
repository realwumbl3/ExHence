import zyX, { html } from "./zyX-es6.js";

import ExHentaiCtrl from './exhentai-ctrl.js';

/**
 * @this {ExHentaiCtrl}
 */
export default function () {
    const bottomOutRepr = (state) => state === "nothing" ? "do nothing" : "goto next page";
    const sidesRepr = (state) => state === "sides" ? "side columns" : "first/last thumbnail";

    [...document.body.querySelectorAll(".ExHentaiCTRL-Options")].forEach(_ => _.remove());
    html`
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
}
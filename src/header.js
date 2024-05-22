import zyX, { html } from "./zyX-es6.js";

import ExHentaiCtrl from './exhentai-ctrl.js';

import showOptions from './options.js';
import showHelper from './helper.js';

/**
 * @this {ExHentaiCtrl}
 * @param {HTMLElement} exheader - the vanilla exheader element
 */
export default function (exheader) {
    this.verbose && console.log('[ExHentaiCTRL] | Extending vanilla header...');
    html`
		<div><span this=opts class="nbw custom">exHentai-CTRL Options</span></div>
		<div><span this=help class="nbw custom">Show Hotkeys</span></div>
		<div><span this=cleartab class="nbw custom">Clear History.</span></div>
		`
        .appendTo(exheader)
        .pass(({ opts, cleartab, help }) => {
            opts.addEventListener("click", (e) => showOptions.call(this))
            help.addEventListener("click", (e) => showHelper.call(this))
            cleartab.addEventListener("click", (e) => this.clearState())
        })
}
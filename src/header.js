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
		<div><span this=opts class="nbw custom" zyx-click="${showOptions.bind(this)}">CTRL Options</span></div>
		<div><span this=help class="nbw custom" zyx-click="${showHelper.bind(this)}">Show Hotkeys</span></div>
		<div><span this=cleartab class="nbw custom" zyx-click="${this.clearState.bind(this)}">Clear History.</span></div>
    `
        .appendTo(exheader)
}

import zyX, { html, css } from "./zyX-es6.js";

import ExHentaiCtrl from "./main.js";
import showOptions from "./options.js";
import showHelper from "./helper.js";

export function CustomEHLogo() {
	return html`
		<a
			class="EhLogo" href="https://exhentai.org"
			style="background-image: url('https://exhentai.org/favicon.ico');"
		></a>
	`;
}


/**
 * @this {ExHentaiCtrl}
 * @param {HTMLElement} exheader - the vanilla exheader element
 */
export default function (exheader) {
	this.verbose && console.log("[ExHentaiCTRL] | Extending vanilla header...");
	html`
		<div><span this="cleartab" class="nbw custom">Clear History.</span></div>
	`
		.pass(({ cleartab }) => {
			cleartab.addEventListener("click", () => {
				cleartab.textContent = "CTRL History Cleared!";
				setTimeout(() => (cleartab.textContent = "Clear History."), 1000);
				this.clearState();
			});
		})
		.appendTo(exheader);

	html`
		${CustomEHLogo}
		<span class="Button" zyx-click="${_ => this.pressQ()}">Back</span>
		<span class="Button" zyx-click="${showOptions.bind(this)}">Options</span>
		<span class="Button" zyx-click="${showHelper.bind(this)}">Keys</span>
	`.prependTo(exheader);

}

css`
	.EhLogo {
		display: inline-block;
		width: 2em;
		aspect-ratio: 1/1;
		background-size: contain;
		background-repeat: no-repeat;
		margin-right: 0.5em;
	}
`;

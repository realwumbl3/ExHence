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

	const headerNodes = [...exheader.childNodes]
	const frontpage = headerNodes[0]
	const { watched, popular, torrents, favorites, uconfig, manage, mytags } =
		Object.fromEntries(headerNodes.map(e => [e.firstChild.href.split("/").pop().split(".")[0], e]));

	frontpage.remove();

	for (const node of headerNodes) {
		node.firstChild.innerHTML = node.firstChild.textContent;
		node.replaceWith(node.firstChild)
	}

	html`
		${CustomEHLogo}
		<span class="ExButton" zyx-click="${_ => this.pressQ()}"><div>Back</div></span>
		<span class="ExButton" zyx-click="${showOptions.bind(this)}"><div>Options</div></span>
		<span class="ExButton" zyx-click="${showHelper.bind(this)}"><div>Keys</div></span>
	`.prependTo(exheader);

	html`
		<a this="cleartab" class="nbw custom">Clear History.</a>
	`
		.pass(({ cleartab }) => {
			cleartab.addEventListener("click", () => {
				cleartab.textContent = "CTRL History Cleared!";
				setTimeout(() => (cleartab.textContent = "Clear History."), 1000);
				this.clearState();
			});
		})
		.appendTo(exheader);

}

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

function ButtonHotkeyIndicator(key, { label }) {
	html`<span class="ExButtonHotkeyIndicator">${label}</span>`.appendTo(key);
}

/**
 * @this {ExHentaiCtrl}
 * @param {HTMLElement} exheader - the vanilla exheader element
 */
export default function (exheader) {
	this.verbose && console.log("[ExHentaiCTRL] | Extending vanilla header...");

	const headerNodes = [...exheader.childNodes]
	const frontpage = headerNodes[0]
	frontpage.remove();
	headerNodes.shift();

	const flattedNodes = headerNodes.map(node => {
		const firstChild = node.firstChild;
		node.replaceWith(firstChild)
		return firstChild;
	})

	flattedNodes.forEach(node => {
		node.innerHTML = node.textContent;
	})

	const { watched, popular, torrents, favorites, uconfig, manage, mytags } =
		Object.fromEntries(flattedNodes.map(e => [e.href.split("/").pop().split(".")[0], e]));

	torrents.before(favorites);

	ButtonHotkeyIndicator(favorites, { label: "F" });
	ButtonHotkeyIndicator(watched, { label: "G" });
	ButtonHotkeyIndicator(popular, { label: "P" });

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

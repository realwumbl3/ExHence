import zyX, { html, css } from "./zyX-es6.js";

import ExHentaiCtrl from "./main.js";
import showOptions from "./options.js";
import showHelper from "./helper.js";

export function CustomEHLogo() {
	return html`
		<a
			this=logo class="EhLogo"
			style="background-image: url('https://exhentai.org/favicon.ico');"
		></a>
	`.pass(({ logo }) => {
		logo.addEventListener("click", () => window.location = window.location.origin);
	});
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
		node.classList.add("custom");
	})

	const { watched, popular, torrents, favorites, uconfig, manage, mytags } =
		Object.fromEntries(flattedNodes.map(e => [e.href.split("/").pop().split(".")[0], e]));

	torrents.before(favorites);

	ButtonHotkeyIndicator(favorites, { label: "F" });
	ButtonHotkeyIndicator(watched, { label: "G" });
	ButtonHotkeyIndicator(popular, { label: "P" });

	html`
		${CustomEHLogo}
		<a class="ExButton" zyx-click="${_ => this.pressQ()}"><div>Back</div></a>
		<a class="ExButton" zyx-click="${showOptions.bind(this)}"><div>Options</div></a>
		<a class="ExButton" zyx-click="${showHelper.bind(this)}"><div>Keys</div></a>
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

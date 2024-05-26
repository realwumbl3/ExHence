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

export default class ExHeader {
	/**
	 * @param {ExHentaiCtrl} ExHence
	 * @param {HTMLElement} exheader
	 */
	constructor(ExHence, exheader) {
		this.ExHence = ExHence;
		this.ExHence.log("[ExHentaiCTRL] | Extending vanilla header...");

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

		this.vanillaButtons = Object.fromEntries(flattedNodes.map(e => [e.href.split("/").pop().split(".")[0], e]));

		const { watched, popular, favorites, torrents, uconfig, manage, mytags } = this.vanillaButtons;

		ButtonHotkeyIndicator(favorites, { label: "F" });
		ButtonHotkeyIndicator(watched, { label: "G" });
		ButtonHotkeyIndicator(popular, { label: "P" });

		exheader.innerHTML = "";

		html`
			${CustomEHLogo}
			<a class="ExButton" zyx-click="${_ => this.ExHence.pressQ()}"><div>Back</div></a>
			<a class="ExButton" zyx-click="${showOptions.bind(this.ExHence)}"><div>Options</div></a>
			<a class="ExButton" zyx-click="${showHelper.bind(this.ExHence)}"><div>Keys</div></a>
			${[watched, popular, favorites, torrents, uconfig, manage, mytags]}
			<a this="cleartab" class="nbw custom">Clear History.</a>
		`
			.bind(this)
			.pass(({ cleartab }) => {
				cleartab.addEventListener("click", () => {
					cleartab.textContent = "CTRL History Cleared!";
					setTimeout(() => (cleartab.textContent = "Clear History."), 1000);
					this.ExHence.clearState();
				});
			})
			.appendTo(exheader);

	}

	highlightFavoriteButton() {
		this.vanillaButtons.favorites.classList.add("highlighted");
		zyX(this).delay("highlight", 1500, () => this.vanillaButtons.favorites.classList.remove("highlighted"));
	}

}

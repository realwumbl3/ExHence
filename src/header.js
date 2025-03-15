import zyX, { html } from "./zyX-es6.js";
import { observe } from "./functions.js";

import ExHence from "./main.js";
import showOptions from "./options.js";
import showHelper from "./helper.js";

export function CustomEHLogo() {
	return html`
		<a this=logo class="EhLogo" style="background-image: url('/favicon.ico');"></a>
	`.pass(({ logo }) => {
		logo.addEventListener("click", () => window.location = window.location.origin);
	});
}

function ButtonHotkeyIndicator(key, { label }) {
	html`<span class="ExButtonHotkeyIndicator">${label}</span>`.appendTo(key);
}

export default class ExHeader {
	/**
	 * @param {ExHence} ExHence
	 * @param {HTMLElement} exheader
	 */
	constructor(ExHence, exheader) {
		this.ExHence = ExHence;
		this.ExHence.logging.info("[ExHence] | Extending vanilla header...");

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

		const { watched, popular, favorites, torrents, uconfig, manage, mytags, ...rest } = this.vanillaButtons;

		ButtonHotkeyIndicator(favorites, { label: "F" });
		ButtonHotkeyIndicator(watched, { label: "G" });
		ButtonHotkeyIndicator(popular, { label: "P" });

		exheader.innerHTML = "";

		html`
			${CustomEHLogo} 
			<a class="ExButton" zyx-click="${showOptions.bind(this.ExHence)}"><div>Options</div></a>
			<a class="ExButton" zyx-click="${showHelper.bind(this.ExHence)}"><div>Keys</div></a>
			${[watched, popular, favorites, torrents, uconfig, manage, mytags, ...Object.values(rest)]}
			<a this="cleartab" class="nbw custom">Clear History.</a>
			<span this=right_container class="Right">
				<a class="ExButton" zyx-click="${_ => this.ExHence.pressQ()}"><div>Back</div></a>
			</span>
		`
			.bind(this)
			.appendTo(exheader);

		this.cleartab.addEventListener("click", () => {
			cleartab.textContent = "ExHence History Cleared!";
			setTimeout(() => (cleartab.textContent = "Clear History."), 1000);
			this.ExHence.clearState();
		});
		exheader.style.opacity = 1;

		// Observe the header for a later attached "Log out" button (Sad Panda extension).
		observe(exheader, `a[href="#"]`, (node) => {
			node.style.display = "none";
			const { signout } = html`
				<a this=signout class="ExButton custom" zyx-click="${_ =>node.click()}">Log out</a>
			`.const()
			this.cleartab.after(signout);
		}, true);
	}

	highlightFavoriteButton() {
		this.vanillaButtons.favorites.classList.add("highlighted");
		zyX(this).delay("highlight", 1500, () => this.vanillaButtons.favorites.classList.remove("highlighted"));
	}

}

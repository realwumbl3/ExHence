import { html } from "./zyX-es6.js";

import ExHence from "./main.js";
import { extractImagesAndLinks, fetchDocument } from "./functions.js";
import ExGallery from "./gallery.js";

export default class HighlightedThumb {
    /**
     * 
     * @param {ExGallery} ExGallery 
     */
    constructor(ExGallery) {
        this.ExGallery = ExGallery;
        /** @type {ExHence} */
        this.ExHence = ExGallery.ExHence;

        this.target = null;

        html`
			<div this=highlight class="thumbHighlight"></div>
		`.bind(this)
    }

    async favorite() {
        await favoritePost(this.highlightedHref());
    }

    async download() {
        const { doc, error } = await fetchDocument(this.highlightedHref());
        if (error) return console.error("Download failed:", error);
        const { imgs, links } = extractImagesAndLinks(doc);
        const download = links.find((url) => url.startsWith("https://exhentai.org/fullimg/"))
        if (download) {
            chrome.runtime.sendMessage({ func: "chrome.downloads.download", url: download });
            return;
        }
        const fallback = imgs.find((img) => !img.startsWith("https://exhentai.org/img/"))
        if (fallback) {
            chrome.runtime.sendMessage({ func: "chrome.downloads.download", url: fallback });
            return;
        }
        console.error("No download link found.");
    }

    goToHref() {
        window.location = this.highlightedHref();
    }

    highlightedHref() {
        return this.target.querySelector("a").href;
    }

    /**	
    * @param {HTMLElement} node
     */
    select(node) {
        this.target?.classList.remove("highlighted");
        this.target = node;
        this.target.classList.add("highlighted");
        node.appendChild(this.highlight);
    }

    indexInParent() {
        return this.ExGallery.getGalleryNodes().indexOf(this.target);
    }

    boundsCheck() {
        const nodeBounds = this.target.getBoundingClientRect();
        const padding = this.ExHence.options.autoScrollPadding;
        const headerPadding = this.ExHence.vanillaHeader.clientHeight;
        switch (true) {
            case nodeBounds.top < 0:
                window.scrollTo(0, window.scrollY + nodeBounds.top - (padding + headerPadding));
                break;
            case nodeBounds.bottom > window.innerHeight:
                window.scrollTo(
                    0,
                    window.scrollY + nodeBounds.bottom - window.innerHeight + padding
                );
                break;
        }
    }
}

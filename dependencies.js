function observe(container, selector, func, suicide) {
    "use strict";
    try {
        const newObserver = new MutationObserver((mutationsList) => {
            for (var mutation of mutationsList)
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {
                        if (
                            (typeof node?.querySelectorAll === "function" && node.querySelectorAll(selector).length > 0) ||
                            (typeof node?.matches === "function" && node.matches(selector))
                        ) {
                            func(node);
                            if (suicide) newObserver.disconnect();
                        }
                    }
                }
        })
        newObserver.observe(container, { childList: true, subtree: true });
        return newObserver
    } catch (err) {
        console.error("newObserver", err);
    }
}

function firstInView(nodes) {
    for (const node of nodes) {
        if (node.getBoundingClientRect().top >= 0) {
            return node;
        }
    }
    return false;
}


const oM = (function () {
    function zyxMagic(that, markup) {
        [...markup.querySelectorAll("[push]")].forEach((e) => {
            const attr = e.getAttribute("push");
            if (!(attr in that)) that[attr] = [];
            that[attr].push(e);
            e.removeAttribute("push");
        });
        [...markup.querySelectorAll("[this]")].forEach((e) => {
            const attr = e.getAttribute("this");
            const split_assign = attr.split(" ");
            if (split_assign.length > 1) {
                let first_key = split_assign[0];
                let second_key = split_assign[1];
                if (!(first_key in that)) {
                    that[first_key] = {};
                }
                if (first_key === "images") console.log("second_key", second_key);

                that[first_key][second_key] = e;
            } else if (split_assign.length === 1) {
                that[attr] = e;
            }
            e.removeAttribute("this");
        });
        [...markup.querySelectorAll("[assign-this]")].forEach((e) => (e.this = that));
        let output = markup.querySelector("[return]");
        if (output) output.this = that;
        else output = that;
        return { markup, output };
    }
    function placeObject(what, where) {
        if (typeof where === "string") {
            const placeTarget = document.querySelector(`ph[${where}]`);
            if (placeTarget) placeTarget.replaceWith(what);
            else console.error(where, "not found");
        } else if (typeof where === "object") where.replaceWith(what);
    }
    return function oM(that) {
        return function (htme) {
            if (!that) that = {};
            const { markup, output } = zyxMagic(that, htme);
            const methods = {
                appendTo: (target) => {
                    target.append(markup);
                    return methods;
                },
                prependTo: (target) => {
                    target.prepend(markup);
                    return methods;
                },
                place: (place) => {
                    placeObject(markup, place);
                    return methods;
                },
                with: (_) => {
                    return _(output, markup);
                },
                markup: function () {
                    return markup;
                },
                output: function () {
                    return output;
                },
            };
            return methods;
        };
    }
})()


function html(raw, ...data) {
    const stringExpressions = [];

    for (const [key, val] of Object.entries(data)) {
        if (val instanceof HTMLElement || val instanceof DocumentFragment) {
            stringExpressions.push(`<StrExpr id="${key}"></StrExpr>`);
        } else {
            stringExpressions.push(val);
        }
    }

    const string = String.raw({ raw }, ...stringExpressions);
    const template = stringToTemplate(string);

    for (const strExpPlaceholder of [...template.querySelectorAll("StrExpr")]) strExpPlaceholder.replaceWith(data[strExpPlaceholder.id]);

    return template;
}

function stringToTemplate(string) {
    const templateContent = document.createElement("template").content;
    templateContent.append(...markUpToChildNodes(string));
    return templateContent;
}

function markUpToChildNodes(markup) {
    const markupContent = document.createElement("markup");
    markupContent.innerHTML = markup;
    return markupContent.childNodes;
}

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


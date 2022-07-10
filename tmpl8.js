function tmpl8({
    that = {},
    element,
    markup,
    template,
    placeholder,
    returnTemplate,
    appendTo,
    prependTo,
    debug,
} = {}) {
    if (debug) debugger;

    let styles_container = document.querySelector("styles");
    if (!styles_container) {
        let new_styles_container = document.createElement("styles");
        document.body.after(new_styles_container);
        styles_container = new_styles_container;
    }
    if (styles_container?.loaded_css === undefined) styles_container.loaded_css = [];

    if (markup) {
        element = document.createElement("template").content;
        let markupContent = document.createElement("markup");
        if (typeof markup === "string") {
            markupContent.innerHTML = markup;
        } else if (typeof markup === "object") {
            markupContent = markup;
        }
        element.append(...markupContent.childNodes);
    } else if (template) {
        element = document.querySelector(`template[${template}]`).content.cloneNode(true);
    }

    for (let e of [...element.querySelectorAll("style")]) {
        e.remove();
        if (styles_container.loaded_css.includes(template)) continue;
        styles_container.loaded_css.push(template);
        styles_container.append(e);
        e.setAttribute("template-name", template);
    }

    [...element.querySelectorAll("[push]")].forEach((e) => {
        const attr = e.getAttribute("push");
        if (!(attr in that)) that[attr] = [];
        that[attr].push(e);
        e.removeAttribute("push");
    });

    [...element.querySelectorAll("[assign]")].forEach((e) => {
        const attr = e.getAttribute("assign");
        const split_assign = attr.split(" ");
        if (split_assign.length > 1) {
            let [first_key, second_key] = split_assign;
            if (!(first_key in that)) that[first_key] = {};
            that[first_key][second_key] = e;
        } else if (split_assign.length === 1) {
            that[attr] = e;
        }
        e.removeAttribute("assign");
    });

    if (returnTemplate) {
        that.template = element;
    }

    // [return] Attribute to return only a specific element within the template
    const output_target = element.querySelector("[return]");

    [...element.querySelectorAll("[assign-this]")].forEach((e) => (e.this = that));

    const returned_object = output_target ? output_target : that;

    if (placeholder) {
        if (typeof placeholder === "string")
            document.querySelector(`placeholder[${placeholder}]`).replaceWith(element);
        else if (typeof placeholder === "object") placeholder.replaceWith(element);
    } else if (appendTo) appendTo.append(element);
    else if (prependTo) prependTo.append(element);

    return returned_object;
}

function observeFor(element, func, suicide) {
    'use strict';
    try {
        let observer = new MutationObserver((mutationsList) => {
            for (var mutation of mutationsList) if (mutation.type === 'childList') {
                for (let node of mutation.addedNodes) {
                    if (
                        (typeof node?.querySelectorAll === "function" && node.querySelectorAll(element).length > 0)
                        ||
                        (typeof node?.matches === "function" && node.matches(element))
                    ) {
                        func(node)
                        if (suicide) observer.disconnect()
                    }
                }
            }
        })
        observer.observe(document, { childList: true, subtree: true })
    }
    catch (err) {
        console.log("err.message: " + err.message)
    }
}

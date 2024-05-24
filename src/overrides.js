const og_apply_function = window.apply_json_state;

window.apply_json_state = function (a) {
	og_apply_function(a);
	window.postMessage({ type: "APPLY_JSON_STATE" });
};

"use strict";
exports.id = 532;
exports.ids = [532];
exports.modules = {

/***/ 1532:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dargs)
/* harmony export */ });
const match = (array, value) =>
	array.some(element => (element instanceof RegExp ? element.test(value) : element === value));

function dargs(object, options) {
	const arguments_ = [];
	let extraArguments = [];
	let separatedArguments = [];

	options = {
		useEquals: true,
		shortFlag: true,
		...options
	};

	const makeArguments = (key, value) => {
		const prefix = options.shortFlag && key.length === 1 ? '-' : '--';
		const theKey = (options.allowCamelCase ?
			key :
			key.replace(/[A-Z]/g, '-$&').toLowerCase());

		key = prefix + theKey;

		if (options.useEquals) {
			arguments_.push(key + (value ? `=${value}` : ''));
		} else {
			arguments_.push(key);

			if (value) {
				arguments_.push(value);
			}
		}
	};

	const makeAliasArg = (key, value) => {
		arguments_.push(`-${key}`);

		if (value) {
			arguments_.push(value);
		}
	};

	for (let [key, value] of Object.entries(object)) {
		let pushArguments = makeArguments;

		if (Array.isArray(options.excludes) && match(options.excludes, key)) {
			continue;
		}

		if (Array.isArray(options.includes) && !match(options.includes, key)) {
			continue;
		}

		if (typeof options.aliases === 'object' && options.aliases[key]) {
			key = options.aliases[key];
			pushArguments = makeAliasArg;
		}

		if (key === '--') {
			if (!Array.isArray(value)) {
				throw new TypeError(
					`Expected key \`--\` to be Array, got ${typeof value}`
				);
			}

			separatedArguments = value;
			continue;
		}

		if (key === '_') {
			if (!Array.isArray(value)) {
				throw new TypeError(
					`Expected key \`_\` to be Array, got ${typeof value}`
				);
			}

			extraArguments = value;
			continue;
		}

		if (value === true && !options.ignoreTrue) {
			pushArguments(key, '');
		}

		if (value === false && !options.ignoreFalse) {
			pushArguments(`no-${key}`);
		}

		if (typeof value === 'string') {
			pushArguments(key, value);
		}

		if (typeof value === 'number' && !Number.isNaN(value)) {
			pushArguments(key, String(value));
		}

		if (Array.isArray(value)) {
			for (const arrayValue of value) {
				pushArguments(key, arrayValue);
			}
		}
	}

	for (const argument of extraArguments) {
		arguments_.push(String(argument));
	}

	if (separatedArguments.length > 0) {
		arguments_.push('--');
	}

	for (const argument of separatedArguments) {
		arguments_.push(String(argument));
	}

	return arguments_;
}


/***/ })

};
;
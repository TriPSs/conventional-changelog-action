"use strict";
exports.id = 941;
exports.ids = [941];
exports.modules = {

/***/ 7941:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "readPackageUp": () => (/* binding */ readPackageUp),
  "readPackageUpSync": () => (/* binding */ readPackageUpSync)
});

// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__(9411);
// EXTERNAL MODULE: external "node:url"
var external_node_url_ = __webpack_require__(1041);
// EXTERNAL MODULE: external "node:process"
var external_node_process_ = __webpack_require__(7742);
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__(7561);
;// CONCATENATED MODULE: ./node_modules/yocto-queue/index.js
/*
How it works:
`this.#head` is an instance of `Node` which keeps track of its current value and nests another instance of `Node` that keeps the value that comes after it. When a value is provided to `.enqueue()`, the code needs to iterate through `this.#head`, going deeper and deeper to find the last value. However, iterating through every single item is slow. This problem is solved by saving a reference to the last value as `this.#tail` so that it can reference it to add a new value.
*/

class Node {
	value;
	next;

	constructor(value) {
		this.value = value;
	}
}

class Queue {
	#head;
	#tail;
	#size;

	constructor() {
		this.clear();
	}

	enqueue(value) {
		const node = new Node(value);

		if (this.#head) {
			this.#tail.next = node;
			this.#tail = node;
		} else {
			this.#head = node;
			this.#tail = node;
		}

		this.#size++;
	}

	dequeue() {
		const current = this.#head;
		if (!current) {
			return;
		}

		this.#head = this.#head.next;
		this.#size--;
		return current.value;
	}

	clear() {
		this.#head = undefined;
		this.#tail = undefined;
		this.#size = 0;
	}

	get size() {
		return this.#size;
	}

	* [Symbol.iterator]() {
		let current = this.#head;

		while (current) {
			yield current.value;
			current = current.next;
		}
	}
}

;// CONCATENATED MODULE: ./node_modules/p-limit/index.js


function pLimit(concurrency) {
	if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
		throw new TypeError('Expected `concurrency` to be a number from 1 and up');
	}

	const queue = new Queue();
	let activeCount = 0;

	const next = () => {
		activeCount--;

		if (queue.size > 0) {
			queue.dequeue()();
		}
	};

	const run = async (fn, resolve, args) => {
		activeCount++;

		const result = (async () => fn(...args))();

		resolve(result);

		try {
			await result;
		} catch {}

		next();
	};

	const enqueue = (fn, resolve, args) => {
		queue.enqueue(run.bind(undefined, fn, resolve, args));

		(async () => {
			// This function needs to wait until the next microtask before comparing
			// `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
			// when the run function is dequeued and called. The comparison in the if-statement
			// needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
			await Promise.resolve();

			if (activeCount < concurrency && queue.size > 0) {
				queue.dequeue()();
			}
		})();
	};

	const generator = (fn, ...args) => new Promise(resolve => {
		enqueue(fn, resolve, args);
	});

	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount,
		},
		pendingCount: {
			get: () => queue.size,
		},
		clearQueue: {
			value: () => {
				queue.clear();
			},
		},
	});

	return generator;
}

;// CONCATENATED MODULE: ./node_modules/p-locate/index.js


class EndError extends Error {
	constructor(value) {
		super();
		this.value = value;
	}
}

// The input can also be a promise, so we await it.
const testElement = async (element, tester) => tester(await element);

// The input can also be a promise, so we `Promise.all()` them both.
const finder = async element => {
	const values = await Promise.all(element);
	if (values[1] === true) {
		throw new EndError(values[0]);
	}

	return false;
};

async function pLocate(
	iterable,
	tester,
	{
		concurrency = Number.POSITIVE_INFINITY,
		preserveOrder = true,
	} = {},
) {
	const limit = pLimit(concurrency);

	// Start all the promises concurrently with optional limit.
	const items = [...iterable].map(element => [element, limit(testElement, element, tester)]);

	// Check the promises either serially or concurrently.
	const checkLimit = pLimit(preserveOrder ? 1 : Number.POSITIVE_INFINITY);

	try {
		await Promise.all(items.map(element => checkLimit(finder, element)));
	} catch (error) {
		if (error instanceof EndError) {
			return error.value;
		}

		throw error;
	}
}

;// CONCATENATED MODULE: ./node_modules/locate-path/index.js






const typeMappings = {
	directory: 'isDirectory',
	file: 'isFile',
};

function checkType(type) {
	if (Object.hasOwnProperty.call(typeMappings, type)) {
		return;
	}

	throw new Error(`Invalid type specified: ${type}`);
}

const matchType = (type, stat) => stat[typeMappings[type]]();

const toPath = urlOrPath => urlOrPath instanceof URL ? (0,external_node_url_.fileURLToPath)(urlOrPath) : urlOrPath;

async function locatePath(
	paths,
	{
		cwd = external_node_process_.cwd(),
		type = 'file',
		allowSymlinks = true,
		concurrency,
		preserveOrder,
	} = {},
) {
	checkType(type);
	cwd = toPath(cwd);

	const statFunction = allowSymlinks ? external_node_fs_.promises.stat : external_node_fs_.promises.lstat;

	return pLocate(paths, async path_ => {
		try {
			const stat = await statFunction(external_node_path_.resolve(cwd, path_));
			return matchType(type, stat);
		} catch {
			return false;
		}
	}, {concurrency, preserveOrder});
}

function locatePathSync(
	paths,
	{
		cwd = external_node_process_.cwd(),
		type = 'file',
		allowSymlinks = true,
	} = {},
) {
	checkType(type);
	cwd = toPath(cwd);

	const statFunction = allowSymlinks ? external_node_fs_.statSync : external_node_fs_.lstatSync;

	for (const path_ of paths) {
		try {
			const stat = statFunction(external_node_path_.resolve(cwd, path_), {
				throwIfNoEntry: false,
			});

			if (!stat) {
				continue;
			}

			if (matchType(type, stat)) {
				return path_;
			}
		} catch {}
	}
}

;// CONCATENATED MODULE: ./node_modules/path-exists/index.js


async function pathExists(path) {
	try {
		await fsPromises.access(path);
		return true;
	} catch {
		return false;
	}
}

function pathExistsSync(path) {
	try {
		fs.accessSync(path);
		return true;
	} catch {
		return false;
	}
}

;// CONCATENATED MODULE: ./node_modules/find-up/index.js




const find_up_toPath = urlOrPath => urlOrPath instanceof URL ? (0,external_node_url_.fileURLToPath)(urlOrPath) : urlOrPath;

const findUpStop = Symbol('findUpStop');

async function findUpMultiple(name, options = {}) {
	let directory = external_node_path_.resolve(find_up_toPath(options.cwd) || '');
	const {root} = external_node_path_.parse(directory);
	const stopAt = external_node_path_.resolve(directory, options.stopAt || root);
	const limit = options.limit || Number.POSITIVE_INFINITY;
	const paths = [name].flat();

	const runMatcher = async locateOptions => {
		if (typeof name !== 'function') {
			return locatePath(paths, locateOptions);
		}

		const foundPath = await name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePath([foundPath], locateOptions);
		}

		return foundPath;
	};

	const matches = [];
	// eslint-disable-next-line no-constant-condition
	while (true) {
		// eslint-disable-next-line no-await-in-loop
		const foundPath = await runMatcher({...options, cwd: directory});

		if (foundPath === findUpStop) {
			break;
		}

		if (foundPath) {
			matches.push(external_node_path_.resolve(directory, foundPath));
		}

		if (directory === stopAt || matches.length >= limit) {
			break;
		}

		directory = external_node_path_.dirname(directory);
	}

	return matches;
}

function findUpMultipleSync(name, options = {}) {
	let directory = external_node_path_.resolve(find_up_toPath(options.cwd) || '');
	const {root} = external_node_path_.parse(directory);
	const stopAt = options.stopAt || root;
	const limit = options.limit || Number.POSITIVE_INFINITY;
	const paths = [name].flat();

	const runMatcher = locateOptions => {
		if (typeof name !== 'function') {
			return locatePathSync(paths, locateOptions);
		}

		const foundPath = name(locateOptions.cwd);
		if (typeof foundPath === 'string') {
			return locatePathSync([foundPath], locateOptions);
		}

		return foundPath;
	};

	const matches = [];
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const foundPath = runMatcher({...options, cwd: directory});

		if (foundPath === findUpStop) {
			break;
		}

		if (foundPath) {
			matches.push(external_node_path_.resolve(directory, foundPath));
		}

		if (directory === stopAt || matches.length >= limit) {
			break;
		}

		directory = external_node_path_.dirname(directory);
	}

	return matches;
}

async function findUp(name, options = {}) {
	const matches = await findUpMultiple(name, {...options, limit: 1});
	return matches[0];
}

function findUpSync(name, options = {}) {
	const matches = findUpMultipleSync(name, {...options, limit: 1});
	return matches[0];
}



// EXTERNAL MODULE: ./node_modules/read-pkg/index.js + 2 modules
var read_pkg = __webpack_require__(581);
;// CONCATENATED MODULE: ./node_modules/read-pkg-up/index.js




async function readPackageUp(options) {
	const filePath = await findUp('package.json', options);
	if (!filePath) {
		return;
	}

	return {
		packageJson: await (0,read_pkg.readPackage)({...options, cwd: external_node_path_.dirname(filePath)}),
		path: filePath,
	};
}

function readPackageUpSync(options) {
	const filePath = findUpSync('package.json', options);
	if (!filePath) {
		return;
	}

	return {
		packageJson: (0,read_pkg.readPackageSync)({...options, cwd: external_node_path_.dirname(filePath)}),
		path: filePath,
	};
}


/***/ })

};
;
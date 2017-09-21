// utilities
function initLib() {

	if (!String.prototype.format) {
		String.prototype.format = function () {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function (match, number) {
				return typeof args[number] != 'undefined' ?
					args[number] :
					match;
			});
		};
	}

	if (!Array.prototype.findById) {
		Array.prototype.findById = function (id) {
			for (let i = 0; i < this.length; i++) {
				if (this[i].id == id) return this[i];
			}
			return null;
		}
	}

	if (!Date.prototype.toDateInputValue) {
		Date.prototype.toDateInputValue = (function () {
			var local = new Date(this);
			local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
			return local.toJSON().slice(0, 19);
		});
	}
}



(function (exportsLib) {
	exportsLib.initLib = initLib;
}(typeof exports === 'undefined' ? this.share = {} : exports));
Agile.fx.typing = function(text, el, cb, speed = 63) {
	var arr = text.split("");

	function typing() {
		if (arr.length > 0) {
			el.innerHTML += arr.shift();
			setTimeout(() => {
				typing();
			}, speed)
		} else {
			if(cb) {
				cb();
			}
		}
	}
	typing();
}

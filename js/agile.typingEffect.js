function typingOutput(text, el, speed = 63) {
	var arr = text.split("");

	function typing() {
		if (arr.length > 0) {
			el.innerHTML += arr.shift();
			setTimeout(() => {
				typing();
			}, speed)
		} 
	}
	typing();
}

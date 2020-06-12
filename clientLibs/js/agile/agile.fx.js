Agile.fx = {
    /**
     * 
     * @param {Element} el 
     * @param {String} txt text to display
     * @param {Int} speed speed in milliseconds for the delay between letters
     * @param {Function} cb OPTIONAL callback for after text completion
     * @param {Int} pauseTime The delay between finishing the text and the callback being executed
     */
    typing: function(el, txt, speed = 50, cb, pauseTime = 0) {
        el.innerHTML = null;
        var i = 0;
    
        function typeWriter() {
            if (i < txt.length) {
                el.innerHTML += txt.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                if (typeof cb === 'function') {
                    setTimeout(() => {
                        cb(txt, speed, cb);
                    }, pauseTime);
                }
            }
        }
    
        typeWriter();
    }
}
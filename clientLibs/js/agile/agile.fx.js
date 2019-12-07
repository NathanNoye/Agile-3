Agile.fx = {
    /**
     * 
     * @param {Element ID} id 
     * @param {String} txt text to display
     * @param {Int} speed speed in milliseconds for the delay between letters
     * @param {Function} cb OPTIONAL callback for after text completion
     * @param {Int} pauseTime The delay between finishing the text and the callback being executed
     */
    typing: function(id, txt, speed = 50, cb, pauseTime = 0) {
        document.getElementById(id).innerHTML = null;
        var i = 0;
    
        function typeWriter() {
            if (i < txt.length) {
                document.getElementById(id).innerHTML += txt.charAt(i);
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
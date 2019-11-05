Agile.common = {
    /**
     * @param {JSON} config.where beforebegin, afterbegin, beforeend, afterend
     * @param {JSON} config.el the element to insert the HTML
     * @param {JSON} config.html The actual HTML
     */
    insertHTML: function (config) {
        config.where = config.where || 'beforeend';
        config.el.insertAdjacentHTML(config.where, config.html);
    },
    /**
     * @description Checks if the user browser is mobile
     */
    isMobile: function () {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    /**
     * @description Checks if the website is being viewed via a PWA in standalone mode
     */
    isPWA: function () {
        return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone);
    },
    UUID: function () {
        let dt = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    },
    random: function (min, max) {
        return Math.floor(Math.random() * max) + min;
    },
    /**
     * @param {JSON} config object: before(), always(), method, url, params, requestHeader |=====| REQUIRED
     * @param {fn} before() - called at the very start of the function |=====| OPTIONAL
     * @param {fn}	after() - always called after success() and fail() |=====| OPTIONAL
     * @param {HTTP method | String} method GET, POST, PUT, DELETE, ... Default is POST |=====| OPTIONAL
     * @param {URL | String} url URL of the end. Could be a local file or a URL |=====| REQUIRED
     * @param {JSON} params parameters, like your post parameters |=====| OPTIONAL
     * @memberof Agile.core namespace
     * @returns {Promise}
    */
   ajax: function (config) {
    return new Promise(function (resolve, reject) {
        config.method = config.method.toUpperCase() || "POST";
        typeof config.before === "function" ? config.before() : null;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    resolve(xmlhttp)
                }
                else {
                    reject(xmlhttp)
                }
                typeof config.after === "function" ? config.after(xmlhttp) : null;
            }
        };
        xmlhttp.open(config.method, config.url);

        if (config.params) {
            if (config.contentType == 'formdata') {
                xmlhttp.send(config.params);
            } else {
                xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                let paramstring = "";
                for (var key in config.params) {
                    if (config.params.hasOwnProperty(key)) {
                        paramstring += key + "=" + config.params[key] + "&";
                    }
                }
                xmlhttp.send(paramstring.substr(0, paramstring.length - 1))
            }
        } else {
            xmlhttp.send();
        }
    });
    },
    regexPhone: function (string) {
        return string.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
    },
    regexFLName: function (string) {
        return string.match(/([A-Za-z \'])+[ ]+[A-Za-z \']+/g);
    }
}
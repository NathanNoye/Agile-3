var Agile = {} || Agile;
Agile.core = {} || Agile.core;
Agile.components = {} || Agile.components;
Agile.observable = {} || Agile.observable;
Agile.fx = {} || Agile.fx;

Agile.core = {
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
     * @description Used to initialize all the components in the Agile.components group
     */
    initializeComponents: function () {
        document.querySelectorAll('[data-component]').forEach(key => {
            new Agile.components[key.getAttribute('data-component')](key);
        });
    },
    /**
     * @param {JSON} config object: before(), always(), method, url, parms |=====| REQUIRED
     * @param {fn} before() - called at the very start of the function |=====| OPTIONAL
     * @param {fn}	after() - always called after success() and fail() |=====| OPTIONAL
     * @param {HTTP method | String} method GET, POST, PUT, DELETE, ... Default is GET |=====| OPTIONAL
     * @param {URL | String} url URL of the end. Could be a local file or a URL |=====| REQUIRED
     * @param {JSON} parms parameters, like your post parameters |=====| OPTIONAL
     * @memberof Agile.core namespace
     * @returns {Promise}
    */
    ajax: function (config) {
        return new Promise(function (resolve, reject) {
            config.method = config.method.toUpperCase() || "GET";
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

            if (config.parms) {
                xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                let parmString = "";
                for (var key in config.parms) {
                    if (config.parms.hasOwnProperty(key)) {
                        parmString += key + "=" + config.parms[key] + "&";
                    }
                }
                xmlhttp.send(parmString.substr(0, parmString.length - 1))
            } else {
                xmlhttp.send();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Agile.core.initializeComponents();
});

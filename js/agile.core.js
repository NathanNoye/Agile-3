var Agile = {} || Agile;
Agile.core = {} || Agile.core;
Agile.components = {} || Agile.components;
Agile.observable = {} || Agile.observable;
Agile.fx = {} || Agile.fx;
Agile.emit = {} || Agile.emit;

Agile.core = {
    VM_LIST: [],
    /**
        * @param {rootEl} Root HTML element
        * @param {vm} View Model you're attaching to
        */
       bind: function (rootEl, vm) {
        [].slice.call(rootEl.querySelectorAll('[data-bind]')).forEach(el => {
            var events = el.getAttribute('data-bind').split(',');
            events.forEach(event => {
                var _eventType = event.split(':')[0].replace(' ', '').toLowerCase();
                var fn = event.split(':')[1].replace(' ', '').toString();
                if (_eventType === 'text') {
                    vm[fn] = new Agile.observable.text(el);
                }
                if (_eventType === 'css') {
                    vm[fn] = new Agile.observable.class(el, fn);
                }
                el.addEventListener(_eventType, function (e) {
                    e.preventDefault();
                    try {
                        vm[fn](e, el);
                    } catch (err) {
                        console.error(`There's an error with the ${fn} function `, err)
                    }
                });
                el.removeAttribute('data-bind');
            })
        });
        rootEl.removeAttribute('data-props');
    },
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
    /**
     * @description Used to initialize all the components in the Agile.components group
     */
    initializeComponents: function () {
        document.querySelectorAll('[data-component]').forEach(key => {
            Agile.core.VM_LIST.push(new Agile.components[key.getAttribute('data-component')](key));
        });
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
    /**
     * @param {JSON} config object: before(), always(), method, url, parms, requestHeader |=====| REQUIRED
     * @param {fn} before() - called at the very start of the function |=====| OPTIONAL
     * @param {fn}	after() - always called after success() and fail() |=====| OPTIONAL
     * @param {HTTP method | String} method GET, POST, PUT, DELETE, ... Default is POST |=====| OPTIONAL
     * @param {URL | String} url URL of the end. Could be a local file or a URL |=====| REQUIRED
     * @param {JSON} parms parameters, like your post parameters |=====| OPTIONAL
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

            if (config.parms) {
                if (config.contentType == 'formdata') {
                    xmlhttp.send(config.parms);
                } else {
                    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    let parmString = "";
                    for (var key in config.parms) {
                        if (config.parms.hasOwnProperty(key)) {
                            parmString += key + "=" + config.parms[key] + "&";
                        }
                    }
                    xmlhttp.send(parmString.substr(0, parmString.length - 1))
                }
            } else {
                xmlhttp.send();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Agile.core.initializeComponents();
});

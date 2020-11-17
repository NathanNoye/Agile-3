var Agile = {} || Agile;
Agile.core = {} || Agile.core;
Agile.components = {} || Agile.components;
Agile.observable = {} || Agile.observable;
Agile.fx = {} || Agile.fx;
Agile.emit = {} || Agile.emit;
Agile.crypto = {} || Agile.crypto;
Agile.common = {} || Agile.common;

Agile.core = {
    VM_LIST: [],

    /**
        * @param {rootEl} Root HTML element
        * @param {vm} View Model you're attaching to
        */
       bind: function (rootEl, vm) {

        console.log(rootEl);

        if (rootEl.querySelectorAll('[data-component]').length > 0) {
            rootEl.querySelectorAll('[data-component]').forEach(el => {
                Agile.core.initSingleComponent(el);
            });
        }

        [].slice.call(rootEl.querySelectorAll('[data-bind]')).forEach(el => {
            // * Getting all the events attached to the component * //
            var events = el.getAttribute('data-bind').split(',');
            events.forEach(event => {
                var _eventType = event.split(':')[0].replace(' ', '').toLowerCase();
                var fn = event.split(':')[1].replace(' ', '').toString();

                // * This is for observable text * //
                if (_eventType === 'text') {
                    vm[fn] = new Agile.observable.text(el);
                }

                // * This is for observable css class * //
                if (_eventType === 'css') {
                    vm[fn] = new Agile.observable.class(el, fn);
                }


                el.addEventListener(_eventType, function (e) {

                    // * An array in case we add more event types * //
                    if (["click"].includes(_eventType)) {
                        e.preventDefault();
                    }

                    try {
                        vm[fn](e, el);
                    } catch (err) {
                        console.error(`There's an error with the ${fn} function `, err)
                    }
                });
                el.removeAttribute('data-bind');
            })
        });
    },

    /**
     * @description Used to initialize all the components in the Agile.components group
     */
    initializeComponents: function () {
        document.querySelectorAll('[data-component]').forEach(key => {

            let props = JSON.parse(JSON.stringify(key.dataset));
            let newComponent = new Agile.components[key.getAttribute('data-component')](key, props);
            newComponent["_rebind"] = () => { Agile.core.bind(key, newComponent); }
            Agile.core.VM_LIST.push(newComponent);
            Agile.core.bind(key, newComponent);
            let attrArr = [].slice.call(key.attributes)
            for ( let i = 1; i < attrArr.length; i++) {
                key.removeAttribute(attrArr[i].name)
            }

        });
    },

    /**
     * 
     * @param {String} key intializes single component based on the elements passed in.
     */
    initSingleComponent: function (key) {
        let props = JSON.parse(JSON.stringify(key.dataset));
        let newComponent = new Agile.components[key.getAttribute('data-component')](key, props);
        newComponent["_rebind"] = () => { Agile.core.bind(key, newComponent); }
        Agile.core.VM_LIST.push(newComponent);
        Agile.core.bind(key, newComponent);
        let attrArr = [].slice.call(key.attributes)
        for ( let i = 1; i < attrArr.length; i++) {
            key.removeAttribute(attrArr[i].name)
        }
    },
};

document.addEventListener('DOMContentLoaded', () => {
    Agile.core.initializeComponents();
});

/*
// This is for testing. Later this will be use to send error information asynchronously to a db table or file. Maybe. Idk yet.
(function() {
    var exLog = console.error;
    console.error = function(msg) {
        exLog.apply(this, arguments);
        alert(msg);
    }
})()
*/
// HOW TO USE THE OBSERVABLE CLASS
// -- Note: The bind object should not be touched. Don't do it. Please. I'll cry. I spent a long time trying to get this to work. I was basically walking in the dark trying to get this to work. So please no. Please.
// OBSERVABLE TEXT - make text update the UI automatically
/** Creating one
    *  HTML -  <p data-bind="text: variableName"></p>
    *  JS -    self.variableName.set('Value goes here');
    *          After using the setter method - the UI will automatically update with the text. 
    *          ALTERNATIVELY you can pass in an HTML template
    *          OPTIONALLY you can call a callback upon successful setting
    * */
// OBSERVABLE CSS - make a CSS class appear conditionally
/** Creating one
    *  HTML -  <p data-bind="css: cssClassName"></p>
    *  JS -    self.cssClassName.check(condition);
    *          The check function will check if the value is true. If it is, it will pass apply the class. 
    *          OPTIONALLY you can call a callback if the value is true
    * */
// OBSERVABLE VARIABLE - allow for a callback function if a variable changes 
/** Creating one
    *  HTML -  NONE
    *  JS -    this.variable = new Agile.observable.variable(INITIAL_VALUE, function(){})
    *          Watches for changes to the variable in the setter method. If a change is detected - the callback gets triggered.
    * */
// OBSERVABLE ARRAY - allow for a callback function if a variable changes 
/** Creating one
    *  HTML -  NONE
    *  JS -    this.variable = new Agile.observable.array(pushFunction(){}, removeFunction(){})
    *          Watches for changes to the array in the push and remove method. If a change is detected - the callback gets triggered.
    * */
// UNDER THE HOOD
/**
* Prototype or regular functions?
* The 'regular' functions are really just appending private members to your component meaning it's local scopped.
* The prototype functions are shared by each of the components but use the 'regular' functions to reference the local scope. 
* This strategy saves memory and load times
* */
Agile.observable = {
    text: function (element) {
        var self = this;
        this.element = element;
        this.initialValue = element.innerHTML;
        this.set = function (value, callback) {
            self.element.innerHTML = value;
            if (callback && typeof callback === "function") {
                callback();
            }
        }
        this.add = function (value, callback) {
            self.element.innerHTML += value + '\n';
            if (callback && typeof callback === "function") {
                callback();
            }
        }
        this.get = function () {
            return self.initialValue;
        }
    },
    class: function (element, cssClass) {
        var self = this;
        this.element = element;
        this.cssClass = cssClass;
        this.check = function (value, callback) {
            if (value === true || value === 'true') {
                self.element.classList.add(self.cssClass);
                if (callback && typeof callback === "function") {
                    callback();
                }
            } else {
                self.element.classList.remove(self.cssClass);
            }
        }
    },
    variable: function (value, callback) {
        var self = this;
        this.initialValue = value || null;
        this.set = function (value) {
            self.initialValue = value;
            if (self.initialValue != null || self.initialValue != value) {
                if (callback && typeof callback === "function") {
                    callback();
                }
            }
        }
        this.get = function () {
            return self.initialValue;
        }
    },
    array: function (add, remove) {
        var self = this;
        this.items = new Array();
        this.push = function (item) {
            this.items.push(item)
            add(item);
        }

        this.remove = function (item) {
            var index = self.items.indexOf(item);
            if (index > -1) {
                self.items.splice(index, 1);
                remove(item)
            } else {
                console.error(`item "${item}" not found in array`)
            }
        }

        this.length = function () {
            return self.items.length;
        }
    },
    attribute : function () {
    
    }
};

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
Agile.crypto = {
    salt: function () {

    },
    pepper: function () {

    },
    encrypt: function (readableString) {
        var result = "";
        for (i = 0; i < readableString.length; i++) {
            if (i < readableString.length - 1) {
                result += readableString.charCodeAt(i) + 10;
                result += "-";
            }
            else {
                result += readableString.charCodeAt(i) + 10;
            }
        }
        return result;
    },
    decrypt: function (encryptedString) {
        var result = "";
        var array = encryptedString.split("-");
    
        for (i = 0; i < array.length; i++) {
            result += String.fromCharCode(array[i] - 10);
        }
        return result;
    }
}
Agile.emit = {
    /**
     * @description Executes a function on a specific component with a matching emit-receiver signature. 
     * STEP 1: Loops through all the VMs looking for a property that contains a matching signature for the emit-receive.
     * STEP 2: If it's found - the function gets called on the receiver function
     * @param {function name} signature 
     * @param {json} data 
     */
    call: function (signature, data) {
        Agile.core.VM_LIST.forEach(vm => {
            if(vm.config.emitReceive == signature) {
                vm[signature](data);
            }
        });
    }
}
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
document.addEventListener('DOMContentLoaded', function () {
    
});
Agile.components.BreadCrumbs = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    self.render();
}

Agile.components.BreadCrumbs.prototype.render = function () {
    var self = this;

    var browserPath = window.location.pathname.split('/');
    var crumbs = "<a href='/'>Home</a> ▸ ";
    var relativePath = "";
    browserPath.shift();

    var lastItemIndex = browserPath.length - 1;

    if (browserPath[lastItemIndex] == "") {
        browserPath.pop();
    }

    var extension = browserPath[lastItemIndex].indexOf('.') > -1
        ? browserPath[lastItemIndex].substring(browserPath[lastItemIndex].indexOf('.'), browserPath[lastItemIndex].length)
        : "";

    for (var i = 0; i < browserPath.length; i++) {
        if (i == browserPath.length - 1) {
            crumbs += `<span>${browserPath[i].replace('-', ' ').substring(0, browserPath[i].indexOf('.') != -1 ? browserPath[i].indexOf('.') : browserPath[i].length)}</span>`;
        } else {
            relativePath += `/${browserPath[i]}`;
            crumbs += `<a href="${relativePath}${extension}">${browserPath[i].replace('-', ' ')}</a> ▸ `;
        }
    }


    self.root.innerHTML += crumbs;
}

Agile.components.Contact = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    self.render();

    self.name = self.root.querySelector('input[name="name"]');
    self.email = self.root.querySelector('input[name="email"]');
    self.message = self.root.querySelector('textarea');
}

Agile.components.Contact.prototype.render = function() {
    var self = this;
    
    self.root.innerHTML += `
        <h2 class="">${self.config.header || "Let's Chat"}</h2>
        <p class="">${self.config.subtext || ""}</p>
        <div>
            <input type="text" placeholder="Name" name="name" required>
            <input type="text" placeholder="Email" name="email" required data-bind="css: fail">
        </div>
        <textarea name="message" placeholder="Message"></textarea>
        <button data-bind="click: sendEmail">Send Message</button>
    `;
}

Agile.components.Contact.prototype.sendEmail = function(e, target) {
    var self = this;

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(self.email.value))) {
        self.fail.check(true)
        return;
    }

    var emailData = {
        name: self.name.value,
        email: self.email.value,
        message: self.message.value,
    };



    console.log('email being sent: ', emailData)
}


/**
 * @name ImageGallery
 * @author Nate Noye
 * @description Creates an image gallery from a JSON string containing 2 values - image source and alt. Later on it will allow for image categories which the user will be able to filter through.
 * @param {DOM element} root 
 */
Agile.components.ImageGallery = function (root, config) {

    // Internal properties
    var self = this;
    this.root = root;
    this.config = config
    this.pagination = 9;
    this.paginationIndex = 0;
    this.dataSource = null;
    this.currentImageIndex = 0;

    // Create the markup with events and stuff. Basically the front end setup
    self.render();

    // Make references to the DOM nodes only after the render function
    self.imageContainer = self.root.querySelector('[data-images]');
    self.modal = self.root.querySelector('[data-modal]');
    self.modalImage = self.root.querySelector('[data-modal] > div > img');
    self.modalText = self.root.querySelector('[data-modal] > div:last-of-type');
    self.loadMoreElement = self.root.querySelector('[data-load-more]');

    self._displayImages();
}

Agile.components.ImageGallery.prototype.render = function () {
    var self = this;

    self.root.innerHTML += `
        <div data-modal class="hide">
            <p data-bind="click: toggleModal" class="toggleModal">╳</p>
            <div>
                <img class="center" data-bind="click: viewFullResImg">
            </div>
            <div>
                <img src="/assets/components/image-gallery/left-arrow.png" class="left-arrow" data-bind="click: previousImage">
                <img src="/assets/components/image-gallery/right-arrow.png" class="right-arrow" data-bind="click: nextImage">
            </div>
            <div></div>
        </div>
        <div data-images></div>
        <p data-load-more></p>
    `;
}

Agile.components.ImageGallery.prototype.toggleModal = function (e, target) {
    var self = this;
    self.root.querySelector('[data-modal]').classList.toggle('hide');
}

Agile.components.ImageGallery.prototype.viewFullResImg = function (e, target) {
    window.open(target.src);
}

Agile.components.ImageGallery.prototype.loadMore = function (e, target) {
    var self = this;

    self.paginationIndex++;
    self._displayImages();
}

Agile.components.ImageGallery.prototype._showImageInModal = function (e, target) {
    var self = this;
    self.currentImageIndex = target.dataset.index;
    self.modal.classList.toggle('hide');
    self.modalImage.src = target.src.replace('min', 'full_res');
    self.modalText.innerHTML = `<h6>Click image to view full resolution</h6>`;
}

Agile.components.ImageGallery.prototype.previousImage = function (e, target) {
    var self = this;
    if (self.currentImageIndex == 0) {
        self.currentImageIndex = self.dataSource.length - 1;
    } else {
        self.currentImageIndex--;
    }
    self.modalImage.src = self.dataSource[self.currentImageIndex].src.replace('min', 'full_res');
}

Agile.components.ImageGallery.prototype.nextImage = function (e, target) {
    var self = this;
    if (self.currentImageIndex == self.dataSource.length - 1) {
        self.currentImageIndex = 0;
    } else {
        self.currentImageIndex++;
    }
    self.modalImage.src = self.dataSource[self.currentImageIndex].src.replace('min', 'full_res');
}



Agile.components.ImageGallery.prototype._displayImages = function () {
    var self = this;

    Agile.common.ajax({
        method: "GET",
        url: self.config.url
    }).then(function (response) {
        self.dataSource = JSON.parse(response.response);
        _show(self.dataSource);
    }).catch(function (err) {
        console.error("Something went wrong", err);
    });


    function _show(source) {
        for (let i = self.pagination * self.paginationIndex; i < (self.pagination * self.paginationIndex) + self.pagination; i++) {
            if (i == source.length) {
                self.loadMoreElement.remove();
                break;
            } else {
                Agile.common.insertHTML({
                    el: self.imageContainer,
                    html: `
                        <div>
                            <img src="" alt="${source[i].alt}" class="invisible" data-source="${source[i].src}" data-bind="click: _showImageInModal" data-index="${i}">
                        </div>
                    `
                })
            }
        }

        // Apply lazy loading
        let images = [].slice.call(self.root.querySelectorAll('[data-images] > div > [data-source]'));
        images.forEach(image => {
            image.addEventListener('load', () => {
                setTimeout(() => {
                    _loadImageAsync();
                    image.classList.remove('invisible');
                }, 125);
            })
        });

        function _loadImageAsync() {
            if (images.length > 0) {
                images[0].src = images[0].dataset.source;
                images[0].removeAttribute('data-source')
                images.shift();
            } else {
                self.intersectionObserver();
                self._rebind();
            }
        }

        _loadImageAsync();
    }
}

Agile.components.ImageGallery.prototype.intersectionObserver = function () {
    var self = this;
    const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                self.loadMore();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.10 });

    const elements = [...self.root.querySelectorAll('[data-load-more]')];
    elements.forEach((element) => intersectionObserver.observe(element));
}
Agile.components.NavBar = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    self.render();

    this.navBar = self.root.querySelector('.nav-standard');
}

Agile.components.NavBar.prototype.render = function() {
    var self = this;

    var links = "";
    JSON.parse(self.config.links).forEach(prop => {
        for (key in prop) {
            links += `<a data-bind="click: hrefClick" href="${prop[key]}">${key}</a>`;
        }
    })

    self.root.innerHTML += `
        <div class="nav-ham color-accent" data-bind="click: hbMenu">☰</div>
        <nav class="nav-standard flat-shadow-around-large slide">
            ${links}
        </nav>
    `;
}

Agile.components.NavBar.prototype.hrefClick = function (e, target) {
    window.location.href = target.href;
}

Agile.components.NavBar.prototype.hbMenu = function (e, target) {
    var self = this;
    self.navBar.classList.toggle("slide");
}
Agile.components.RTE = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    // * This stores the content of the RTE
    this.content = "";

    // * State management
    this.state = new Agile.observable.variable('INIT', function () {
        console.log('State changed:', self.state.get());
    })

    self.render();

    this.iframe = self.root.querySelector('iframe');

    self.init();
}

Agile.components.RTE.prototype.render = function() {
    var self = this;

    self.root.innerHTML += `
        <div>
            <button data-bind="click: bold">B</button>
            <button data-bind="click: italic">I</button>
            <button data-bind="click: underline">U</button>
            &nbsp;
            <button data-bind="click: leftAlign">L</button>
            <button data-bind="click: centerAlign">C</button>
            <button data-bind="click: rightAlign">R</button>
            &nbsp;
            <select data-bind="change: formatText">
                <option disabled selected>-- Select style --</option>
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
                <option value="H4">H4</option>
                <option value="H5">H5</option>
                <option value="H6">H6</option>
                <option value="P">P</option>
            </select>
            &nbsp;
            <button data-bind="click: createLink">R</button>
        </div>
        <iframe></iframe>
    `;
}

Agile.components.RTE.prototype.init = function () {
    var self = this;

    var cssLink = document.createElement("link");
    cssLink.href = "prod/main-min.css"; 
    cssLink.rel = "stylesheet"; 
    cssLink.type = "text/css"; 
    self.iframe.contentDocument.head.appendChild(cssLink);

    self.iframe.contentDocument.designMode = 'On';
    self.state.set('Design mode on');
}

Agile.components.RTE.prototype._execCommand = function (command) {
    var self = this;
    self.iframe.contentDocument.execCommand(command, false, null);
    self.iframe.contentWindow.document.body.focus();
}

Agile.components.RTE.prototype._execCommandWithArg = function (command, arg) {
    var self = this;
    self.iframe.contentDocument.execCommand(command, false, arg);
    self.iframe.contentWindow.document.body.focus();
}

Agile.components.RTE.prototype.bold = function (e, t) {
    var self = this;
    self._execCommand('bold');
}

Agile.components.RTE.prototype.italic = function (e, t) {
    var self = this;
    self._execCommand('italic');
}

Agile.components.RTE.prototype.underline = function (e, t) {
    var self = this;
    self._execCommand('underline');
}

Agile.components.RTE.prototype.leftAlign = function (e, t) {
    var self = this;
    self._execCommand('justifyLeft');
}

Agile.components.RTE.prototype.centerAlign = function (e, t) {
    var self = this;
    self._execCommand('justifyCenter');
}

Agile.components.RTE.prototype.rightAlign = function (e, t) {
    var self = this;
    self._execCommand('justifyRight');
}

Agile.components.RTE.prototype.formatText = function (e, t) {
    var self = this;
    self._execCommandWithArg('formatBlock', t.value);
}

Agile.components.RTE.prototype.createLink = function (e, t) {
    var self = this;
    self._execCommandWithArg('createLink', prompt('Enter URL: ', 'http://'));
}
/**
 * @param {int} config.min - optional
 * @param {int} config.max - optional
 * @param {String} config.title - optional
 * @param {Bool} config.showValues - optional - shows the value of the bar
 * @param {json key} config.json_key
 * @param {json value} config.json_value
 */

Agile.components.SideGraph = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    if (!("min" in config)) {
        config.min = 0;
    }

    if (!("max" in config)) {
        config.max = 100;
    }

    if (!("title" in config)) {
        config.title = "";
    }

    if (!("showValues" in config)) {
        config.showValues = false;
    }

    if (!("values" in config)) {
        console.error('Please include a json formatted "values" config to contain the name - value pairs for your graph.');
    } else {
        this.values = JSON.parse(config.values);
    }

    console.log((parseInt(self.values["Design"]) / parseInt(self.config.max)) * 100);

    self.render();
}

Agile.components.SideGraph.prototype.render = function() {
    var self = this;

    console.log(self.values);

    var bar = "";
    for(var key in self.values) {
        bar += `
                <div class="bar">
                    <div class="key">${key}</div>
                    <div class="value-container">
                        <div class="value" style="width: ${(parseInt(self.values[key]) / parseInt(self.config.max)) * 100}%;">
                        ${self.showValues ? self.values[key] : "&nbsp;"}
                        </div>
                    </div>
                </div>
            `;
    }

    self.root.innerHTML += `
        <h3>${self.config.title}</h3>
        <div class="bars">
            ${bar}
        </div>
    `;
}
Agile.components.Tabs = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    self.render();

    this.navBar = self.root.querySelector('.nav-standard');
}

Agile.components.Tabs.prototype.render = function() {
    var self = this;
    
    var tabs = "";
    self.config.tabs.split(',').forEach((component) => {
        tabs += `
            <div class="tab active">
                <div data-component="${component}"></div>
            </div>
        `;
    })

    self.root.innerHTML += tabs;
}
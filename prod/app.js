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
    /**
     * @param {JSON} config object: before(), always(), method, url, parms |=====| REQUIRED
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

Agile.emit = {
    init: function () {
        [].slice.call(document.querySelectorAll('[data-props*="emit-send"]')).forEach(emitter => {
            Agile.emit.emitters.push({
                element: emitter,
                function: JSON.parse(emitter.getAttribute('data-props'))["emit-send"]
            });
        });

        [].slice.call(document.querySelectorAll('[data-props*="emit-receive"]')).forEach(receiver => {
            Agile.emit.receivers.push({
                element: receiver,
                function: JSON.parse(receiver.getAttribute('data-props'))["emit-receive"]
            })
        });

    },
    emitters: [],
    receivers: [],
    /**
     * @description Executes a function on a specific component with a matching emit-receiver signature. 
     * STEP 1: Loops through all the VMs looking for a property that contains a matching signature for the emit-receive.
     * STEP 2: If it's found - the function gets called on the receiver function
     * @param {function name} signature 
     * @param {json} data 
     */
    call: function (signature, data) {

        Agile.core.VM_LIST.forEach(vm => {
            if(vm.props["emit-receive"] == signature) {
                vm[signature](data);
            }
        });

    }
}


Agile.emit.init();
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

document.addEventListener('DOMContentLoaded', function () {
    /* HOME PAGE Typing effect */
    /*Agile.fx.typing("53% Of users leave your website if it takes longer than 3 seconds to load.", document.querySelector("#header-CTA > h1"), function () {
        console.log('done')
    })*/
})
Agile.components.Contact = function (root) {
    var self = this;
    this.root = root;
    this.props = JSON.parse(self.root.dataset.props);

    self.render();
    
    Agile.core.bind(self.root, this);

    self.name = self.root.querySelector('input[name="name"]');
    self.email = self.root.querySelector('input[name="email"]');
    self.message = self.root.querySelector('textarea');
}

Agile.components.Contact.prototype.render = function() {
    var self = this;


    self.root.innerHTML += `
        <h2 class="">${self.props.header || "Let's Chat"}</h2>
        <p class="">${self.props.subtext || ""}</p>
        <div>
            <input type="text" placeholder="Name" name="name" required>
            <input type="text" placeholder="Email" name="email" required>
        </div>
        <textarea name="message" placeholder="Message"></textarea>
        <button data-bind="click: sendEmail">Send Message</button>
    `;
}

Agile.components.Contact.prototype.sendEmail = function(e, target) {
    var self = this;

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(self.email.value))) {
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
Agile.components.ImageGallery = function (root) {

    // Internal properties
    var self = this;
    this.root = root;
    this.props = JSON.parse(self.root.dataset.props);
    this.pagination = 7;
    this.paginationIndex = 0;
    this.dataSource = null;

    // Create the markup with events and stuff. Basically the front end setup
    self.render();

    // Make references to the DOM nodes only after the render function
    self.button = self.root.querySelector('button');
    self.imageContainer = self.root.querySelector('[data-images]');
    self.modal = self.root.querySelector('[data-modal]');
    self.modalImage = self.root.querySelector('[data-modal] > div > img');
    self.modalText = self.root.querySelector('[data-modal] > div:last-of-type');

    self._displayImages();

    // Bind the functions
    Agile.core.bind(self.root, this)
}

Agile.components.ImageGallery.prototype.render = function () {
    var self = this;

    self.root.innerHTML += `
        <div data-modal class="hide" data-bind="click: toggleModal">
            <div>
                <img class="center" data-bind="click: viewFullResImg">
            </div>
            <div></div>
        </div>
        <div data-images></div>
        <button class="forms-button forms-button-full center" data-bind="click: loadMore">Load More</button>
    `;
}

Agile.components.ImageGallery.prototype.toggleModal = function (e, target) {
    target.classList.toggle('hide');
}

Agile.components.ImageGallery.prototype.viewFullResImg = function (e, target) {
    window.open(target.src);
}

Agile.components.ImageGallery.prototype.getImagesFromServer = function (e, target) {
    Agile.core.ajax({
        method: "GET",
        url: "images.json",
        before: function () {
            console.log('show loading spinner')
        },
        after: function () {
            console.log('get rid of loading spinner')
        }
    }).then(function (response) {
        _show(JSON.parse(response.response));
    }).catch(function (err) {
        console.error("Something went wrong", err);
    });
}

Agile.components.ImageGallery.prototype.loadMore = function (e, target) {
    var self = this;

    self.paginationIndex++;
    self._displayImages();
}

Agile.components.ImageGallery.prototype._showImageInModal = function (e, target) {
    var self = this;

    self.modal.classList.toggle('hide');
    self.modalImage.src = target.src.replace('compressed', 'full');
    self.modalText.innerHTML = `${target.alt} <br><small>Click image for full resolution</small>`;
}

Agile.components.ImageGallery.prototype._displayImages = function () {
    var self = this;

    Agile.core.ajax({
        method: "GET",
        url: "images.json",
        parm: self.props,
        before: function () {
            //EX: start loading spinner
        },
        after: function () {
            //EX: hide loading spinner
        }
    }).then(function (response) {
        self.dataSource = JSON.parse(response.response)
        _show(self.dataSource);
    }).catch(function (err) {
        console.error("Something went wrong", err);
    });


    function _show(source) {
        for (let i = self.pagination * self.paginationIndex; i < (self.pagination * self.paginationIndex) + self.pagination; i++) {

            Agile.core.insertHTML({
                el: self.imageContainer,
                html: `
                    <div>
                        <img src="" alt="${source.images[i].alt}" class="invisible" data-source="${source.images[i].src}" data-bind="click: _showImageInModal">
                    </div>
                `
            })

            if (i == source.totalRecords - 1) {
                self.button.parentNode.removeChild(self.button);
                break;
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
            }
        }

        _loadImageAsync();

        Agile.observable.bind(self.root, self)
    }
}
Agile.components.NavBar = function (root) {
    var self = this;
    this.root = root;
    this.props = JSON.parse(self.root.dataset.props);

    self.render();

    this.navBar = self.root.querySelector('.nav-standard');

    Agile.core.bind(self.root, this);
}

Agile.components.NavBar.prototype.render = function() {
    var self = this;

    var links = "";
    self.props.links.forEach(prop => {
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
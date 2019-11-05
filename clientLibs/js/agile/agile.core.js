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
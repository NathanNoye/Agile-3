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
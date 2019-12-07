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
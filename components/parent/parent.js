Agile.components.Parent = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    self.render();
}

Agile.components.Parent.prototype.render = function () {
    var self = this;

    self.root.innerHTML = `
        <button data-bind="click: getProps">Parent button</button>
    `;
}

Agile.components.Parent.prototype.getProps = function () {
    var self = this;

    console.log("This is the config for the Parent component:", self.config);
    Agile.emit.call("sendToChild", {"test": "fromParent"})
}
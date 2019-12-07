Agile.components.Child = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    self.render();
}

Agile.components.Child.prototype.render = function () {
    var self = this;

    self.root.innerHTML = `
        <button data-bind="click: getProps">Child button</button>
    `;
}

Agile.components.Child.prototype.getProps = function () {
    var self = this;

    console.log("This is the config for the Child component:", self.config);
}

Agile.components.Child.prototype.sendToChild = function (data) {
    var self = this;

    console.log("in Child", data);
}
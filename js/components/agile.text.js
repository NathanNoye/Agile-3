Agile.components.Text = function (root) {
    var self = this;
    this.root = root;
    this.props = JSON.parse(self.root.dataset.props);

    self.render();
    
    Agile.core.bind(self.root, this);

    self.thisText.set('Hello World');
}

Agile.components.Text.prototype.render = function() {
    var self = this;


    self.root.innerHTML += `
        <h1 data-bind="text: thisText"></h1>
        <button data-bind="click: textContent">test</button>
    `;
}

Agile.components.Text.prototype.textContent = function(data) {
    var self = this;
    
    self.thisText.set(data.filter || "fallback text", function () {
        Agile.emit.call("textChangedEMIT", "Hello from text change")
    });
}

Agile.components.Text.prototype.textChangedEMIT = function(data) {
    var self = this;
    
    self.thisText.set(data);
}


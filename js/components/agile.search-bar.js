Agile.components.SearchBar = function (root) {
    var self = this;
    this.root = root;
    this.props = JSON.parse(self.root.dataset.props);

    self.render();

    this.input = self.root.querySelector('input');
    
    Agile.core.bind(self.root, this);
}

Agile.components.SearchBar.prototype.render = function() {
    var self = this;


    self.root.innerHTML += `
        <input type="text">
        <button data-bind="click: sendData">Send</button>
    `;
}

Agile.components.SearchBar.prototype.sendData = function(e, target) {
    var self = this;

    var data;

    data = {filter: self.input.value}
    Agile.emit.call("textContent", data)
}
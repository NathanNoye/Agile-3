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
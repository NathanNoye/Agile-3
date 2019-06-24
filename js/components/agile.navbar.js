Agile.components.NavBar = function (root) {
    var self = this;
    this.root = root;
    this.props = JSON.parse(self.root.dataset.props);

    self.render();

    this.navBar = self.root.querySelector('.nav-standard');

    Agile.observable.bind(self.root, this);
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
        <div class="nav-ham" data-bind="click: hbMenu">☰</div>
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
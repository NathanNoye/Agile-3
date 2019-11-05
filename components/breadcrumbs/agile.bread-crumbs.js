Agile.components.BreadCrumbs = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    self.render();
}

Agile.components.BreadCrumbs.prototype.render = function () {
    var self = this;

    var browserPath = window.location.pathname.split('/');
    var crumbs = "<a href='/'>Home</a> ▸ ";
    var relativePath = "";
    browserPath.shift();

    var lastItemIndex = browserPath.length - 1;

    if (browserPath[lastItemIndex] == "") {
        browserPath.pop();
    }

    var extension = browserPath[lastItemIndex].indexOf('.') > -1
        ? browserPath[lastItemIndex].substring(browserPath[lastItemIndex].indexOf('.'), browserPath[lastItemIndex].length)
        : "";

    for (var i = 0; i < browserPath.length; i++) {
        if (i == browserPath.length - 1) {
            crumbs += `<span>${browserPath[i].replace('-', ' ').substring(0, browserPath[i].indexOf('.') != -1 ? browserPath[i].indexOf('.') : browserPath[i].length)}</span>`;
        } else {
            relativePath += `/${browserPath[i]}`;
            crumbs += `<a href="${relativePath}${extension}">${browserPath[i].replace('-', ' ')}</a> ▸ `;
        }
    }


    self.root.innerHTML += crumbs;
}

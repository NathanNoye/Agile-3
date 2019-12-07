Agile.components.RTE = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    // * This stores the content of the RTE
    this.content = "";

    // * State management
    this.state = new Agile.observable.variable('INIT', function () {
        console.log('State changed:', self.state.get());
    })

    self.render();

    this.iframe = self.root.querySelector('iframe');

    self.init();
}

Agile.components.RTE.prototype.render = function() {
    var self = this;

    self.root.innerHTML += `
        <div>
            <button data-bind="click: bold">B</button>
            <button data-bind="click: italic">I</button>
            <button data-bind="click: underline">U</button>
            &nbsp;
            <button data-bind="click: leftAlign">L</button>
            <button data-bind="click: centerAlign">C</button>
            <button data-bind="click: rightAlign">R</button>
            &nbsp;
            <select data-bind="change: formatText">
                <option disabled selected>-- Select style --</option>
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
                <option value="H4">H4</option>
                <option value="H5">H5</option>
                <option value="H6">H6</option>
                <option value="P">P</option>
            </select>
            &nbsp;
            <button data-bind="click: createLink">R</button>
        </div>
        <iframe></iframe>
    `;
}

Agile.components.RTE.prototype.init = function () {
    var self = this;

    var cssLink = document.createElement("link");
    cssLink.href = "prod/main-min.css"; 
    cssLink.rel = "stylesheet"; 
    cssLink.type = "text/css"; 
    self.iframe.contentDocument.head.appendChild(cssLink);

    self.iframe.contentDocument.designMode = 'On';
    self.state.set('Design mode on');
}

Agile.components.RTE.prototype._execCommand = function (command) {
    var self = this;
    self.iframe.contentDocument.execCommand(command, false, null);
    self.iframe.contentWindow.document.body.focus();
}

Agile.components.RTE.prototype._execCommandWithArg = function (command, arg) {
    var self = this;
    self.iframe.contentDocument.execCommand(command, false, arg);
    self.iframe.contentWindow.document.body.focus();
}

Agile.components.RTE.prototype.bold = function (e, t) {
    var self = this;
    self._execCommand('bold');
}

Agile.components.RTE.prototype.italic = function (e, t) {
    var self = this;
    self._execCommand('italic');
}

Agile.components.RTE.prototype.underline = function (e, t) {
    var self = this;
    self._execCommand('underline');
}

Agile.components.RTE.prototype.leftAlign = function (e, t) {
    var self = this;
    self._execCommand('justifyLeft');
}

Agile.components.RTE.prototype.centerAlign = function (e, t) {
    var self = this;
    self._execCommand('justifyCenter');
}

Agile.components.RTE.prototype.rightAlign = function (e, t) {
    var self = this;
    self._execCommand('justifyRight');
}

Agile.components.RTE.prototype.formatText = function (e, t) {
    var self = this;
    self._execCommandWithArg('formatBlock', t.value);
}

Agile.components.RTE.prototype.createLink = function (e, t) {
    var self = this;
    self._execCommandWithArg('createLink', prompt('Enter URL: ', 'http://'));
}
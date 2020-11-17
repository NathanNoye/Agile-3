/**
 * @param {int} config.min - optional
 * @param {int} config.max - optional
 * @param {String} config.title - optional
 * @param {Bool} config.showValues - optional - shows the value of the bar
 * @param {json key} config.json_key
 * @param {json value} config.json_value
 */

Agile.components.SideGraph = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    if (!("min" in config)) {
        config.min = 0;
    }

    if (!("max" in config)) {
        config.max = 100;
    }

    if (!("title" in config)) {
        config.title = "";
    }

    if (!("showValues" in config)) {
        config.showValues = false;
    }

    if (!("values" in config)) {
        console.error('Please include a json formatted "values" config to contain the name - value pairs for your graph.');
    } else {
        this.values = JSON.parse(config.values);
    }

    console.log((parseInt(self.values["Design"]) / parseInt(self.config.max)) * 100);

    self.render();
}

Agile.components.SideGraph.prototype.render = function() {
    var self = this;

    console.log(self.values);

    var bar = "";
    for(var key in self.values) {
        bar += `
                <div class="bar">
                    <div class="key">${key}</div>
                    <div class="value-container">
                        <div class="value" style="width: ${(parseInt(self.values[key]) / parseInt(self.config.max)) * 100}%;">
                        ${self.showValues ? self.values[key] : "&nbsp;"}
                        </div>
                    </div>
                </div>
            `;
    }

    self.root.innerHTML += `
        <h3>${self.config.title}</h3>
        <div class="bars">
            ${bar}
        </div>
    `;
}
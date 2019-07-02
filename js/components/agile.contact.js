Agile.components.Contact = function (root) {
    var self = this;
    this.root = root;
    this.props = JSON.parse(self.root.dataset.props);

    self.render();
    
    Agile.core.bind(self.root, this);
}

Agile.components.Contact.prototype.render = function() {
    var self = this;


    self.root.innerHTML += `
        <h2 class="center">Let's Chat</h2>
        <p class="center"></p>
        <div>
            <input type="text" placeholder="Name" name="name" required>
            <input type="text" placeholder="Email" name="email" required>
        </div>
        <textarea name="message"></textarea>
        <button data-bind="click: sendEmail">Send Message</button>
    `;
}


Agile.components.Contact = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    self.render();

    self.name = self.root.querySelector('input[name="name"]');
    self.email = self.root.querySelector('input[name="email"]');
    self.message = self.root.querySelector('textarea');
}

Agile.components.Contact.prototype.render = function() {
    var self = this;
    
    self.root.innerHTML += `
        <h2 class="">${self.config.header || "Let's Chat"}</h2>
        <p class="">${self.config.subtext || ""}</p>
        <div>
            <input type="text" placeholder="Name" name="name" required>
            <input type="text" placeholder="Email" name="email" required data-bind="css: fail">
        </div>
        <textarea name="message" placeholder="Message"></textarea>
        <button data-bind="click: sendEmail">Send Message</button>
    `;
}

Agile.components.Contact.prototype.sendEmail = function(e, target) {
    var self = this;

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(self.email.value))) {
        self.fail.check(true)
        return;
    }

    var emailData = {
        name: self.name.value,
        email: self.email.value,
        message: self.message.value,
    };



    console.log('email being sent: ', emailData)
}


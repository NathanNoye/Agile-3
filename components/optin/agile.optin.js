Agile.components.Optin = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    self.config.subtitle = self.config.subtitle != null ? `<br>${self.config.subtitle}` : '';
    self.config.bottomText = self.config.bottomText != null ? `<br>${self.config.bottomText}` : '';
    self.config.thankyouSubtitle = self.config.thankyouSubtitle != null ? `<br>${self.config.thankyouSubtitle}` : '';

    self.render();

    self.txtEmail = self.root.querySelector('input[name="email"]');

    self.emailPanel = self.root.querySelector('#emailOptin');
    self.thankyouPanel = self.root.querySelector('#thankyou');
}

Agile.components.Optin.prototype.render = function () {
    var self = this;

    console.log(self.values);

    self.root.innerHTML += `
    <div class="animate" id="emailOptin">
        <div class="${self.config.styleRoot}">
            <div class="container">
                <h1>${self.config.title}</h1>
                <p>${self.config.subtitle}</p>
                <br>
                <input type="text" placeholder="Enter your BEST email address here..." name="email" required data-bind="css: fail">
                <br>
                <br>
                <div class="cta" data-bind="click: nextPage">
                    ${self.config.cta}
                </div>
                <br>
                <br>
                <p>${self.config.bottomText}</p>
            </div>
        </div>
    </div>
    <div class="hide" id="thankyou">

        <!-- temporary - replace with thank you page -->
        <div class="${self.config.styleRoot}">
            <div class="container">
                <h1>${self.config.thankyouTitle}</h1>
                <p>${self.config.thankyouSubtitle}</p>
                <br>
                <div class="cta" data-bind="click: gotoOffer">
                    ${self.config.thankyouCta}
                </div>
                <br>
                <br>
                <p>${self.config.bottomText}</p>
            </div>
        </div>
    
    </div>
    `;
}

Agile.components.Optin.prototype.nextPage = function (e, target) {
    var self = this;

    self.txtEmail.classList.remove('fail');

    if (self.txtEmail.value == null || self.txtEmail.value == '' || self.txtEmail.value.length < 1) {
        self.fail.check(true)
        return;
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(self.txtEmail.value))) {
        self.fail.check(true)
        return;
    }

    self.txtEmail.classList.remove('fail');

    // send email to mailchimp
    // show next div

    self.emailPanel.classList.add('hide');

    self.thankyouPanel.classList.add('animate');
    self.thankyouPanel.classList.remove('hide');
}

Agile.components.Optin.prototype.gotoOffer = function (e, target) {
    var self = this;

    window.location.href = self.config.hoplink;
}


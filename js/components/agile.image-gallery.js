/**
 * @name ImageGallery
 * @author Nate Noye
 * @description Creates an image gallery from a JSON string containing 2 values - image source and alt. Later on it will allow for image categories which the user will be able to filter through.
 * @param {DOM element} root 
 */
Agile.components.ImageGallery = function (root) {

    // Internal properties
    var self = this;
    this.root = root;
    this.props = JSON.parse(self.root.dataset.props);
    this.pagination = 7;
    this.paginationIndex = 0;
    this.dataSource = null;

    // Create the markup with events and stuff. Basically the front end setup
    self.render();

    // Make references to the DOM nodes only after the render function
    self.button = self.root.querySelector('button');
    self.imageContainer = self.root.querySelector('[data-images]');
    self.modal = self.root.querySelector('[data-modal]');
    self.modalImage = self.root.querySelector('[data-modal] > div > img');
    self.modalText = self.root.querySelector('[data-modal] > div:last-of-type');

    self._displayImages();

    // Bind the functions
    Agile.core.bind(self.root, this)
}

Agile.components.ImageGallery.prototype.render = function () {
    var self = this;

    self.root.innerHTML += `
        <div data-modal class="hide" data-bind="click: toggleModal">
            <div>
                <img class="center" data-bind="click: viewFullResImg">
            </div>
            <div></div>
        </div>
        <div data-images></div>
        <button class="forms-button forms-button-full center" data-bind="click: loadMore">Load More</button>
    `;
}

Agile.components.ImageGallery.prototype.toggleModal = function (e, target) {
    target.classList.toggle('hide');
}

Agile.components.ImageGallery.prototype.viewFullResImg = function (e, target) {
    window.open(target.src);
}

Agile.components.ImageGallery.prototype.getImagesFromServer = function (e, target) {
    Agile.core.ajax({
        method: "GET",
        url: "images.json",
        before: function () {
            console.log('show loading spinner')
        },
        after: function () {
            console.log('get rid of loading spinner')
        }
    }).then(function (response) {
        _show(JSON.parse(response.response));
    }).catch(function (err) {
        console.error("Something went wrong", err);
    });
}

Agile.components.ImageGallery.prototype.loadMore = function (e, target) {
    var self = this;

    self.paginationIndex++;
    self._displayImages();
}

Agile.components.ImageGallery.prototype._showImageInModal = function (e, target) {
    var self = this;

    self.modal.classList.toggle('hide');
    self.modalImage.src = target.src.replace('compressed', 'full');
    self.modalText.innerHTML = `${target.alt} <br><small>Click image for full resolution</small>`;
}

Agile.components.ImageGallery.prototype._displayImages = function () {
    var self = this;

    Agile.core.ajax({
        method: "GET",
        url: "images.json",
        parm: self.props,
        before: function () {
            //EX: start loading spinner
        },
        after: function () {
            //EX: hide loading spinner
        }
    }).then(function (response) {
        self.dataSource = JSON.parse(response.response)
        _show(self.dataSource);
    }).catch(function (err) {
        console.error("Something went wrong", err);
    });


    function _show(source) {
        for (let i = self.pagination * self.paginationIndex; i < (self.pagination * self.paginationIndex) + self.pagination; i++) {

            Agile.core.insertHTML({
                el: self.imageContainer,
                html: `
                    <div>
                        <img src="" alt="${source.images[i].alt}" class="invisible" data-source="${source.images[i].src}" data-bind="click: _showImageInModal">
                    </div>
                `
            })

            if (i == source.totalRecords - 1) {
                self.button.parentNode.removeChild(self.button);
                break;
            }
        }

        // Apply lazy loading
        let images = [].slice.call(self.root.querySelectorAll('[data-images] > div > [data-source]'));
        images.forEach(image => {
            image.addEventListener('load', () => {
                setTimeout(() => {
                    _loadImageAsync();
                    image.classList.remove('invisible');
                }, 125);
            })
        });

        function _loadImageAsync() {
            if (images.length > 0) {
                images[0].src = images[0].dataset.source;
                images[0].removeAttribute('data-source')
                images.shift();
            }
        }

        _loadImageAsync();

        Agile.observable.bind(self.root, self)
    }
}
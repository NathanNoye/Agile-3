/**
 * @name ImageGallery
 * @author Nate Noye
 * @description Creates an image gallery from a JSON string containing 2 values - image source and alt. Later on it will allow for image categories which the user will be able to filter through.
 * @param {DOM element} root 
 */
Agile.components.ImageGallery = function (root, config) {

    // Internal properties
    var self = this;
    this.root = root;
    this.config = config
    this.pagination = 9;
    this.paginationIndex = 0;
    this.dataSource = null;
    this.currentImageIndex = 0;

    // Create the markup with events and stuff. Basically the front end setup
    self.render();

    // Make references to the DOM nodes only after the render function
    self.imageContainer = self.root.querySelector('[data-images]');
    self.modal = self.root.querySelector('[data-modal]');
    self.modalImage = self.root.querySelector('[data-modal] > div > img');
    self.modalText = self.root.querySelector('[data-modal] > div:last-of-type');
    self.loadMoreElement = self.root.querySelector('[data-load-more]');

    self._displayImages();
}

Agile.components.ImageGallery.prototype.render = function () {
    var self = this;

    self.root.innerHTML += `
        <div data-modal class="hide">
            <p data-bind="click: toggleModal" class="toggleModal">╳</p>
            <div>
                <img class="center" data-bind="click: viewFullResImg">
            </div>
            <div>
                <img src="/assets/components/image-gallery/left-arrow.png" class="left-arrow" data-bind="click: previousImage">
                <img src="/assets/components/image-gallery/right-arrow.png" class="right-arrow" data-bind="click: nextImage">
            </div>
            <div></div>
        </div>
        <div data-images></div>
        <p data-load-more></p>
    `;
}

Agile.components.ImageGallery.prototype.toggleModal = function (e, target) {
    var self = this;
    self.root.querySelector('[data-modal]').classList.toggle('hide');
}

Agile.components.ImageGallery.prototype.viewFullResImg = function (e, target) {
    window.open(target.src);
}

Agile.components.ImageGallery.prototype.loadMore = function (e, target) {
    var self = this;

    self.paginationIndex++;
    self._displayImages();
}

Agile.components.ImageGallery.prototype._showImageInModal = function (e, target) {
    var self = this;
    self.currentImageIndex = target.dataset.index;
    self.modal.classList.toggle('hide');
    self.modalImage.src = target.src.replace('min', 'full_res');
    self.modalText.innerHTML = `<h6>Click image to view full resolution</h6>`;
}

Agile.components.ImageGallery.prototype.previousImage = function (e, target) {
    var self = this;
    if (self.currentImageIndex == 0) {
        self.currentImageIndex = self.dataSource.length - 1;
    } else {
        self.currentImageIndex--;
    }
    self.modalImage.src = self.dataSource[self.currentImageIndex].src.replace('min', 'full_res');
}

Agile.components.ImageGallery.prototype.nextImage = function (e, target) {
    var self = this;
    if (self.currentImageIndex == self.dataSource.length - 1) {
        self.currentImageIndex = 0;
    } else {
        self.currentImageIndex++;
    }
    self.modalImage.src = self.dataSource[self.currentImageIndex].src.replace('min', 'full_res');
}



Agile.components.ImageGallery.prototype._displayImages = function () {
    var self = this;

    Agile.common.ajax({
        method: "GET",
        url: self.config.url
    }).then(function (response) {
        self.dataSource = JSON.parse(response.response);
        _show(self.dataSource);
    }).catch(function (err) {
        console.error("Something went wrong", err);
    });


    function _show(source) {
        for (let i = self.pagination * self.paginationIndex; i < (self.pagination * self.paginationIndex) + self.pagination; i++) {
            if (i == source.length) {
                self.loadMoreElement.remove();
                break;
            } else {
                Agile.common.insertHTML({
                    el: self.imageContainer,
                    html: `
                        <div>
                            <img src="" alt="${source[i].alt}" class="invisible" data-source="${source[i].src}" data-bind="click: _showImageInModal" data-index="${i}">
                        </div>
                    `
                })
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
            } else {
                self.intersectionObserver();
                self._rebind();
            }
        }

        _loadImageAsync();
    }
}

Agile.components.ImageGallery.prototype.intersectionObserver = function () {
    var self = this;
    const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                self.loadMore();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.10 });

    const elements = [...self.root.querySelectorAll('[data-load-more]')];
    elements.forEach((element) => intersectionObserver.observe(element));
}
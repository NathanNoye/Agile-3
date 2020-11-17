var Agile={}||Agile;Agile.core={}||Agile.core,Agile.components={}||Agile.components,Agile.observable={}||Agile.observable,Agile.fx={}||Agile.fx,Agile.emit={}||Agile.emit,Agile.crypto={}||Agile.crypto,Agile.common={}||Agile.common,Agile.core={VM_LIST:[],bind:function(e,t){console.log(e),e.querySelectorAll("[data-component]").length>0&&e.querySelectorAll("[data-component]").forEach(e=>{Agile.core.initSingleComponent(e)}),[].slice.call(e.querySelectorAll("[data-bind]")).forEach(e=>{e.getAttribute("data-bind").split(",").forEach(n=>{var i=n.split(":")[0].replace(" ","").toLowerCase(),o=n.split(":")[1].replace(" ","").toString();"text"===i&&(t[o]=new Agile.observable.text(e)),"css"===i&&(t[o]=new Agile.observable.class(e,o)),e.addEventListener(i,function(n){["click"].includes(i)&&n.preventDefault();try{t[o](n,e)}catch(e){console.error(`There's an error with the ${o} function `,e)}}),e.removeAttribute("data-bind")})})},initializeComponents:function(){document.querySelectorAll("[data-component]").forEach(e=>{let t=JSON.parse(JSON.stringify(e.dataset)),n=new(Agile.components[e.getAttribute("data-component")])(e,t);n._rebind=(()=>{Agile.core.bind(e,n)}),Agile.core.VM_LIST.push(n),Agile.core.bind(e,n);let i=[].slice.call(e.attributes);for(let t=1;t<i.length;t++)e.removeAttribute(i[t].name)})},initSingleComponent:function(e){let t=JSON.parse(JSON.stringify(e.dataset)),n=new(Agile.components[e.getAttribute("data-component")])(e,t);n._rebind=(()=>{Agile.core.bind(e,n)}),Agile.core.VM_LIST.push(n),Agile.core.bind(e,n);let i=[].slice.call(e.attributes);for(let t=1;t<i.length;t++)e.removeAttribute(i[t].name)}},document.addEventListener("DOMContentLoaded",()=>{Agile.core.initializeComponents()}),Agile.observable={text:function(e){var t=this;this.element=e,this.initialValue=e.innerHTML,this.set=function(e,n){t.element.innerHTML=e,n&&"function"==typeof n&&n()},this.add=function(e,n){t.element.innerHTML+=e+"\n",n&&"function"==typeof n&&n()},this.get=function(){return t.initialValue}},class:function(e,t){var n=this;this.element=e,this.cssClass=t,this.check=function(e,t){!0===e||"true"===e?(n.element.classList.add(n.cssClass),t&&"function"==typeof t&&t()):n.element.classList.remove(n.cssClass)}},variable:function(e,t){var n=this;this.initialValue=e||null,this.set=function(e){n.initialValue=e,null==n.initialValue&&n.initialValue==e||t&&"function"==typeof t&&t()},this.get=function(){return n.initialValue}},array:function(e,t){var n=this;this.items=new Array,this.push=function(t){this.items.push(t),e(t)},this.remove=function(e){var i=n.items.indexOf(e);i>-1?(n.items.splice(i,1),t(e)):console.error(`item "${e}" not found in array`)},this.length=function(){return n.items.length}},attribute:function(){}},Agile.common={insertHTML:function(e){e.where=e.where||"beforeend",e.el.insertAdjacentHTML(e.where,e.html)},isMobile:function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)},isPWA:function(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone},UUID:function(){let e=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){let n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?n:3&n|8).toString(16)})},random:function(e,t){return Math.floor(Math.random()*t)+e},ajax:function(e){return new Promise(function(t,n){e.method=e.method.toUpperCase()||"POST","function"==typeof e.before&&e.before();var i=new XMLHttpRequest;if(i.onreadystatechange=function(){i.readyState==XMLHttpRequest.DONE&&(200==i.status?t(i):n(i),"function"==typeof e.after&&e.after(i))},i.open(e.method,e.url),e.params)if("formdata"==e.contentType)i.send(e.params);else{i.setRequestHeader("Content-type","application/x-www-form-urlencoded");let t="";for(var o in e.params)e.params.hasOwnProperty(o)&&(t+=o+"="+e.params[o]+"&");i.send(t.substr(0,t.length-1))}else i.send()})},regexPhone:function(e){return e.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)},regexFLName:function(e){return e.match(/([A-Za-z \'])+[ ]+[A-Za-z \']+/g)}},Agile.crypto={salt:function(){},pepper:function(){},encrypt:function(e){var t="";for(i=0;i<e.length;i++)i<e.length-1?(t+=e.charCodeAt(i)+10,t+="-"):t+=e.charCodeAt(i)+10;return t},decrypt:function(e){var t="",n=e.split("-");for(i=0;i<n.length;i++)t+=String.fromCharCode(n[i]-10);return t}},Agile.emit={call:function(e,t){Agile.core.VM_LIST.forEach(n=>{n.config.emitReceive==e&&n[e](t)})}},Agile.fx={typing:function(e,t,n=50,i,o=0){e.innerHTML=null;var a=0;!function r(){a<t.length?(e.innerHTML+=t.charAt(a),a++,setTimeout(r,n)):"function"==typeof i&&setTimeout(()=>{i(t,n,i)},o)}()}},document.addEventListener("DOMContentLoaded",function(){}),Agile.components.BreadCrumbs=function(e,t){this.root=e,this.config=t,this.render()},Agile.components.BreadCrumbs.prototype.render=function(){var e=window.location.pathname.split("/"),t="<a href='/'>Home</a> ▸ ",n="";e.shift();var i=e.length-1;""==e[i]&&e.pop();for(var o=e[i].indexOf(".")>-1?e[i].substring(e[i].indexOf("."),e[i].length):"",a=0;a<e.length;a++)a==e.length-1?t+=`<span>${e[a].replace("-"," ").substring(0,-1!=e[a].indexOf(".")?e[a].indexOf("."):e[a].length)}</span>`:t+=`<a href="${n+=`/${e[a]}`}${o}">${e[a].replace("-"," ")}</a> ▸ `;this.root.innerHTML+=t},Agile.components.Contact=function(e,t){this.root=e,this.config=t,this.render(),this.name=this.root.querySelector('input[name="name"]'),this.email=this.root.querySelector('input[name="email"]'),this.message=this.root.querySelector("textarea")},Agile.components.Contact.prototype.render=function(){this.root.innerHTML+=`\n        <h2 class="">${this.config.header||"Let's Chat"}</h2>\n        <p class="">${this.config.subtext||""}</p>\n        <div>\n            <input type="text" placeholder="Name" name="name" required>\n            <input type="text" placeholder="Email" name="email" required data-bind="css: fail">\n        </div>\n        <textarea name="message" placeholder="Message"></textarea>\n        <button data-bind="click: sendEmail">Send Message</button>\n    `},Agile.components.Contact.prototype.sendEmail=function(e,t){if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email.value)){var n={name:this.name.value,email:this.email.value,message:this.message.value};console.log("email being sent: ",n)}else this.fail.check(!0)},Agile.components.ImageGallery=function(e,t){this.root=e,this.config=t,this.pagination=9,this.paginationIndex=0,this.dataSource=null,this.currentImageIndex=0,this.render(),this.imageContainer=this.root.querySelector("[data-images]"),this.modal=this.root.querySelector("[data-modal]"),this.modalImage=this.root.querySelector("[data-modal] > div > img"),this.modalText=this.root.querySelector("[data-modal] > div:last-of-type"),this.loadMoreElement=this.root.querySelector("[data-load-more]"),this._displayImages()},Agile.components.ImageGallery.prototype.render=function(){this.root.innerHTML+='\n        <div data-modal class="hide">\n            <p data-bind="click: toggleModal" class="toggleModal">╳</p>\n            <div>\n                <img class="center" data-bind="click: viewFullResImg">\n            </div>\n            <div>\n                <img src="/assets/components/image-gallery/left-arrow.png" class="left-arrow" data-bind="click: previousImage">\n                <img src="/assets/components/image-gallery/right-arrow.png" class="right-arrow" data-bind="click: nextImage">\n            </div>\n            <div></div>\n        </div>\n        <div data-images></div>\n        <p data-load-more></p>\n    '},Agile.components.ImageGallery.prototype.toggleModal=function(e,t){this.root.querySelector("[data-modal]").classList.toggle("hide")},Agile.components.ImageGallery.prototype.viewFullResImg=function(e,t){window.open(t.src)},Agile.components.ImageGallery.prototype.loadMore=function(e,t){this.paginationIndex++,this._displayImages()},Agile.components.ImageGallery.prototype._showImageInModal=function(e,t){this.currentImageIndex=t.dataset.index,this.modal.classList.toggle("hide"),this.modalImage.src=t.src.replace("min","full_res"),this.modalText.innerHTML="<h6>Click image to view full resolution</h6>"},Agile.components.ImageGallery.prototype.previousImage=function(e,t){0==this.currentImageIndex?this.currentImageIndex=this.dataSource.length-1:this.currentImageIndex--,this.modalImage.src=this.dataSource[this.currentImageIndex].src.replace("min","full_res")},Agile.components.ImageGallery.prototype.nextImage=function(e,t){this.currentImageIndex==this.dataSource.length-1?this.currentImageIndex=0:this.currentImageIndex++,this.modalImage.src=this.dataSource[this.currentImageIndex].src.replace("min","full_res")},Agile.components.ImageGallery.prototype._displayImages=function(){var e=this;Agile.common.ajax({method:"GET",url:e.config.url}).then(function(t){e.dataSource=JSON.parse(t.response),function(t){for(let n=e.pagination*e.paginationIndex;n<e.pagination*e.paginationIndex+e.pagination;n++){if(n==t.length){e.loadMoreElement.remove();break}Agile.common.insertHTML({el:e.imageContainer,html:`\n                        <div>\n                            <img src="" alt="${t[n].alt}" class="invisible" data-source="${t[n].src}" data-bind="click: _showImageInModal" data-index="${n}">\n                        </div>\n                    `})}let n=[].slice.call(e.root.querySelectorAll("[data-images] > div > [data-source]"));function i(){n.length>0?(n[0].src=n[0].dataset.source,n[0].removeAttribute("data-source"),n.shift()):(e.intersectionObserver(),e._rebind())}n.forEach(e=>{e.addEventListener("load",()=>{setTimeout(()=>{i(),e.classList.remove("invisible")},125)})}),i()}(e.dataSource)}).catch(function(e){console.error("Something went wrong",e)})},Agile.components.ImageGallery.prototype.intersectionObserver=function(){var e=this;const t=new IntersectionObserver((t,n)=>{t.forEach(t=>{t.isIntersecting&&(e.loadMore(),n.unobserve(t.target))})},{threshold:.1});[...e.root.querySelectorAll("[data-load-more]")].forEach(e=>t.observe(e))},Agile.components.NavBar=function(e,t){this.root=e,this.config=t,this.render(),this.navBar=this.root.querySelector(".nav-standard")},Agile.components.NavBar.prototype.render=function(){var e="";JSON.parse(this.config.links).forEach(t=>{for(key in t)e+=`<a data-bind="click: hrefClick" href="${t[key]}">${key}</a>`}),this.root.innerHTML+=`\n        <div class="nav-ham color-accent" data-bind="click: hbMenu">☰</div>\n        <nav class="nav-standard flat-shadow-around-large slide">\n            ${e}\n        </nav>\n    `},Agile.components.NavBar.prototype.hrefClick=function(e,t){window.location.href=t.href},Agile.components.NavBar.prototype.hbMenu=function(e,t){this.navBar.classList.toggle("slide")},Agile.components.RTE=function(e,t){var n=this;this.root=e,this.config=t,this.content="",this.state=new Agile.observable.variable("INIT",function(){console.log("State changed:",n.state.get())}),n.render(),this.iframe=n.root.querySelector("iframe"),n.init()},Agile.components.RTE.prototype.render=function(){this.root.innerHTML+='\n        <div>\n            <button data-bind="click: bold">B</button>\n            <button data-bind="click: italic">I</button>\n            <button data-bind="click: underline">U</button>\n            &nbsp;\n            <button data-bind="click: leftAlign">L</button>\n            <button data-bind="click: centerAlign">C</button>\n            <button data-bind="click: rightAlign">R</button>\n            &nbsp;\n            <select data-bind="change: formatText">\n                <option disabled selected>-- Select style --</option>\n                <option value="H1">H1</option>\n                <option value="H2">H2</option>\n                <option value="H3">H3</option>\n                <option value="H4">H4</option>\n                <option value="H5">H5</option>\n                <option value="H6">H6</option>\n                <option value="P">P</option>\n            </select>\n            &nbsp;\n            <button data-bind="click: createLink">R</button>\n        </div>\n        <iframe></iframe>\n    '},Agile.components.RTE.prototype.init=function(){var e=document.createElement("link");e.href="prod/main-min.css",e.rel="stylesheet",e.type="text/css",this.iframe.contentDocument.head.appendChild(e),this.iframe.contentDocument.designMode="On",this.state.set("Design mode on")},Agile.components.RTE.prototype._execCommand=function(e){this.iframe.contentDocument.execCommand(e,!1,null),this.iframe.contentWindow.document.body.focus()},Agile.components.RTE.prototype._execCommandWithArg=function(e,t){this.iframe.contentDocument.execCommand(e,!1,t),this.iframe.contentWindow.document.body.focus()},Agile.components.RTE.prototype.bold=function(e,t){this._execCommand("bold")},Agile.components.RTE.prototype.italic=function(e,t){this._execCommand("italic")},Agile.components.RTE.prototype.underline=function(e,t){this._execCommand("underline")},Agile.components.RTE.prototype.leftAlign=function(e,t){this._execCommand("justifyLeft")},Agile.components.RTE.prototype.centerAlign=function(e,t){this._execCommand("justifyCenter")},Agile.components.RTE.prototype.rightAlign=function(e,t){this._execCommand("justifyRight")},Agile.components.RTE.prototype.formatText=function(e,t){this._execCommandWithArg("formatBlock",t.value)},Agile.components.RTE.prototype.createLink=function(e,t){this._execCommandWithArg("createLink",prompt("Enter URL: ","http://"))},Agile.components.SideGraph=function(e,t){this.root=e,this.config=t,"min"in t||(t.min=0),"max"in t||(t.max=100),"title"in t||(t.title=""),"showValues"in t||(t.showValues=!1),"values"in t?this.values=JSON.parse(t.values):console.error('Please include a json formatted "values" config to contain the name - value pairs for your graph.'),console.log(parseInt(this.values.Design)/parseInt(this.config.max)*100),this.render()},Agile.components.SideGraph.prototype.render=function(){console.log(this.values);var e="";for(var t in this.values)e+=`\n                <div class="bar">\n                    <div class="key">${t}</div>\n                    <div class="value-container">\n                        <div class="value" style="width: ${parseInt(this.values[t])/parseInt(this.config.max)*100}%;">\n                        ${this.showValues?this.values[t]:"&nbsp;"}\n                        </div>\n                    </div>\n                </div>\n            `;this.root.innerHTML+=`\n        <h3>${this.config.title}</h3>\n        <div class="bars">\n            ${e}\n        </div>\n    `},Agile.components.Tabs=function(e,t){this.root=e,this.config=t,this.render(),this.navBar=this.root.querySelector(".nav-standard")},Agile.components.Tabs.prototype.render=function(){var e="";this.config.tabs.split(",").forEach(t=>{e+=`\n            <div class="tab active">\n                <div data-component="${t}"></div>\n            </div>\n        `}),this.root.innerHTML+=e};
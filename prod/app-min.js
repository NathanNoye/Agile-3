var Agile={}||Agile;Agile.core={}||Agile.core,Agile.components={}||Agile.components,Agile.observable={}||Agile.observable,Agile.fx={}||Agile.fx,Agile.emit={}||Agile.emit,Agile.crypto={}||Agile.crypto,Agile.core={VM_LIST:[],bind:function(e,t){[].slice.call(e.querySelectorAll("[data-bind]")).forEach(e=>{e.getAttribute("data-bind").split(",").forEach(n=>{var i=n.split(":")[0].replace(" ","").toLowerCase(),o=n.split(":")[1].replace(" ","").toString();"text"===i&&(t[o]=new Agile.observable.text(e)),"css"===i&&(t[o]=new Agile.observable.class(e,o)),e.addEventListener(i,function(n){["click"].includes(i)&&n.preventDefault();try{t[o](n,e)}catch(e){console.error(`There's an error with the ${o} function `,e)}}),e.removeAttribute("data-bind")})}),e.removeAttribute("data-props")},insertHTML:function(e){e.where=e.where||"beforeend",e.el.insertAdjacentHTML(e.where,e.html)},isMobile:function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)},isPWA:function(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone},initializeComponents:function(){document.querySelectorAll("[data-component]").forEach(e=>{Agile.core.VM_LIST.push(new(Agile.components[e.getAttribute("data-component")])(e))})},UUID:function(){let e=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){let n=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"==t?n:3&n|8).toString(16)})},ajax:function(e){return new Promise(function(t,n){e.method=e.method.toUpperCase()||"POST","function"==typeof e.before&&e.before();var i=new XMLHttpRequest;if(i.onreadystatechange=function(){i.readyState==XMLHttpRequest.DONE&&(200==i.status?t(i):n(i),"function"==typeof e.after&&e.after(i))},i.open(e.method,e.url),e.params)if("formdata"==e.contentType)i.send(e.params);else{i.setRequestHeader("Content-type","application/x-www-form-urlencoded");let t="";for(var o in e.params)e.params.hasOwnProperty(o)&&(t+=o+"="+e.params[o]+"&");i.send(t.substr(0,t.length-1))}else i.send()})}},document.addEventListener("DOMContentLoaded",()=>{Agile.core.initializeComponents()}),Agile.observable={text:function(e){var t=this;this.element=e,this.initialValue=e.innerHTML,this.set=function(e,n){t.element.innerHTML=e,n&&"function"==typeof n&&n()},this.add=function(e,n){t.element.innerHTML+=e+"\n",n&&"function"==typeof n&&n()},this.get=function(){return t.initialValue}},class:function(e,t){var n=this;this.element=e,this.cssClass=t,this.check=function(e,t){!0===e||"true"===e?(n.element.classList.add(n.cssClass),t&&"function"==typeof t&&t()):n.element.classList.remove(n.cssClass)}},variable:function(e,t){var n=this;this.initialValue=e||null,this.set=function(e){n.initialValue=e,null==n.initialValue&&n.initialValue==e||t&&"function"==typeof t&&t()},this.get=function(){return n.initialValue}},array:function(e,t){var n=this;this.items=new Array,this.push=function(t){this.items.push(t),e(t)},this.remove=function(e){var i=n.items.indexOf(e);i>-1?(n.items.splice(i,1),t(e)):console.error(`item "${e}" not found in array`)},this.length=function(){return n.items.length}},attribute:function(){}},Agile.crypto={salt:function(){},pepper:function(){},encrypt:function(e){var t="";for(i=0;i<e.length;i++)i<e.length-1?(t+=e.charCodeAt(i)+10,t+="-"):t+=e.charCodeAt(i)+10;return t},decrypt:function(e){var t="",n=e.split("-");for(i=0;i<n.length;i++)t+=String.fromCharCode(n[i]-10);return t}},Agile.emit={init:function(){[].slice.call(document.querySelectorAll('[data-props*="emit-send"]')).forEach(e=>{Agile.emit.emitters.push({element:e,function:JSON.parse(e.getAttribute("data-props"))["emit-send"]})}),[].slice.call(document.querySelectorAll('[data-props*="emit-receive"]')).forEach(e=>{Agile.emit.receivers.push({element:e,function:JSON.parse(e.getAttribute("data-props"))["emit-receive"]})})},emitters:[],receivers:[],call:function(e,t){Agile.core.VM_LIST.forEach(n=>{n.props["emit-receive"]==e&&n[e](t)})}},Agile.emit.init(),Agile.fx.typing=function(e,t,n,i=63){var o=e.split("");!function e(){o.length>0?(t.innerHTML+=o.shift(),setTimeout(()=>{e()},i)):n&&n()}()},document.addEventListener("DOMContentLoaded",function(){}),Agile.components.BreadCrumbs=function(e){this.root=e,this.props=JSON.parse(this.root.dataset.props),this.render(),Agile.core.bind(this.root,this)},Agile.components.BreadCrumbs.prototype.render=function(){var e=window.location.pathname.split("/"),t="<a href='/'>Home</a> ▸ ",n="";e.shift();var i=e.length-1;""==e[i]&&e.pop();for(var o=e[i].indexOf(".")>-1?e[i].substring(e[i].indexOf("."),e[i].length):"",a=0;a<e.length;a++)a==e.length-1?t+=`<span>${e[a].replace("-"," ").substring(0,-1!=e[a].indexOf(".")?e[a].indexOf("."):e[a].length)}</span>`:t+=`<a href="${n+=`/${e[a]}`}${o}">${e[a].replace("-"," ")}</a> ▸ `;this.root.innerHTML+=t},Agile.components.Contact=function(e){this.root=e,this.props=JSON.parse(this.root.dataset.props),this.render(),Agile.core.bind(this.root,this),this.name=this.root.querySelector('input[name="name"]'),this.email=this.root.querySelector('input[name="email"]'),this.message=this.root.querySelector("textarea")},Agile.components.Contact.prototype.render=function(){this.root.innerHTML+=`\n        <h2 class="">${this.props.header||"Let's Chat"}</h2>\n        <p class="">${this.props.subtext||""}</p>\n        <div>\n            <input type="text" placeholder="Name" name="name" required>\n            <input type="text" placeholder="Email" name="email" required data-bind="css: fail">\n        </div>\n        <textarea name="message" placeholder="Message"></textarea>\n        <button data-bind="click: sendEmail">Send Message</button>\n    `},Agile.components.Contact.prototype.sendEmail=function(e,t){if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email.value)){var n={name:this.name.value,email:this.email.value,message:this.message.value};console.log("email being sent: ",n)}else this.fail.check(!0)},Agile.components.ImageGallery=function(e){this.root=e,this.props=JSON.parse(this.root.dataset.props),this.pagination=7,this.paginationIndex=0,this.dataSource=null,this.render(),this.button=this.root.querySelector("button"),this.imageContainer=this.root.querySelector("[data-images]"),this.modal=this.root.querySelector("[data-modal]"),this.modalImage=this.root.querySelector("[data-modal] > div > img"),this.modalText=this.root.querySelector("[data-modal] > div:last-of-type"),this._displayImages(),Agile.core.bind(this.root,this)},Agile.components.ImageGallery.prototype.render=function(){this.root.innerHTML+='\n        <div data-modal class="hide" data-bind="click: toggleModal">\n            <div>\n                <img class="center" data-bind="click: viewFullResImg">\n            </div>\n            <div></div>\n        </div>\n        <div data-images></div>\n        <button class="forms-button forms-button-full center" data-bind="click: loadMore">Load More</button>\n    '},Agile.components.ImageGallery.prototype.toggleModal=function(e,t){t.classList.toggle("hide")},Agile.components.ImageGallery.prototype.viewFullResImg=function(e,t){window.open(t.src)},Agile.components.ImageGallery.prototype.getImagesFromServer=function(e,t){Agile.core.ajax({method:"GET",url:"images.json",before:function(){console.log("show loading spinner")},after:function(){console.log("get rid of loading spinner")}}).then(function(e){_show(JSON.parse(e.response))}).catch(function(e){console.error("Something went wrong",e)})},Agile.components.ImageGallery.prototype.loadMore=function(e,t){this.paginationIndex++,this._displayImages()},Agile.components.ImageGallery.prototype._showImageInModal=function(e,t){this.modal.classList.toggle("hide"),this.modalImage.src=t.src.replace("compressed","full"),this.modalText.innerHTML=`${t.alt} <br><small>Click image for full resolution</small>`},Agile.components.ImageGallery.prototype._displayImages=function(){var e=this;Agile.core.ajax({method:"GET",url:"images.json",parm:e.props,before:function(){},after:function(){}}).then(function(t){e.dataSource=JSON.parse(t.response),function(t){for(let n=e.pagination*e.paginationIndex;n<e.pagination*e.paginationIndex+e.pagination;n++)if(Agile.core.insertHTML({el:e.imageContainer,html:`\n                    <div>\n                        <img src="" alt="${t.images[n].alt}" class="invisible" data-source="${t.images[n].src}" data-bind="click: _showImageInModal">\n                    </div>\n                `}),n==t.totalRecords-1){e.button.parentNode.removeChild(e.button);break}let n=[].slice.call(e.root.querySelectorAll("[data-images] > div > [data-source]"));function i(){n.length>0&&(n[0].src=n[0].dataset.source,n[0].removeAttribute("data-source"),n.shift())}n.forEach(e=>{e.addEventListener("load",()=>{setTimeout(()=>{i(),e.classList.remove("invisible")},125)})}),i(),Agile.observable.bind(e.root,e)}(e.dataSource)}).catch(function(e){console.error("Something went wrong",e)})},Agile.components.NavBar=function(e){this.root=e,this.props=JSON.parse(this.root.dataset.props),this.render(),this.navBar=this.root.querySelector(".nav-standard"),Agile.core.bind(this.root,this)},Agile.components.NavBar.prototype.render=function(){var e="";this.props.links.forEach(t=>{for(key in t)e+=`<a data-bind="click: hrefClick" href="${t[key]}">${key}</a>`}),this.root.innerHTML+=`\n        <div class="nav-ham color-accent" data-bind="click: hbMenu">☰</div>\n        <nav class="nav-standard flat-shadow-around-large slide">\n            ${e}\n        </nav>\n    `},Agile.components.NavBar.prototype.hrefClick=function(e,t){window.location.href=t.href},Agile.components.NavBar.prototype.hbMenu=function(e,t){this.navBar.classList.toggle("slide")};
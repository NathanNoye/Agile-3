# Agile3
Agile 3 makes improvements over AgileCSS & Agile2 and expands in JavaScript.

AGILE 3 NEWEST FEATURES
  - Browser support
  - PROD version (minified) and DEV version
  - Object Oriented JS
  - New observable class
  - One-line components
 
  
  
*FOR DEVS*
CODING STANDARDS
-----------------------------------

*Gulp is used to automate a lot of the coding process. please use gulp default to watch all the CSS and JS files while contributing.*

*Component development*
1. COMPONENTS
  - DO NOT MODIFY THE CORE AGILE CODE
  - Components must be JS objects that use prototypal inheritance
  - They must contain a render function that creates all the event bindings from the JS function
  - The root element must contain the data-component with a matching value spelled EXACTLY how it's spelled in the component. If not - it won't work.
  - Put all your JS component logic in their own files in the folder "js/components"
  - Put all your CSS component styling in their own files in the folder "css/components"

*CSS*
PS: our gulp script adds the vendor prefixes

1. One Class Declaration:
  - You make ONE single class and then access the sub sequent tag via selectors. 
  - You must include the code to recreate what you have created (HTML / CSS) in an example file to see how it works
  
2. All classes start with class name
  - If it's pertaining to images - it starts with image-
  - If it's about forms - it starts with form-
  
3. Multiple choices for classes
  - If you are making a new version of a class - give it a new game.
  - EXAMPLE: form-thick (Forms would be thicker bordered)
  - EXAMPLE: form-align (Forms would be aligned)
  
4. NO DEFAUL STYLES
  - Everything must be in a class or accessed via a selector. If you include something without a class name - it will most likely be rejected (or I'll add a class to it if it's real pretty). Only the base class will contain things SOMETIMES that aren't in a class. If you have a suggestion - please submit it for review, I'd love to see it.
  
5. CROSS BROWSER SUPPORT
  - Must support these browsers: IE11+(ish), CHROME 50+, FF 50+, EDGE, SAFARI


*JavaScript*
1. LIBRARY SUPPORT
  - All functions must be non-library dependant; all functions need to work without things like JQuery, React, Angular, Vue, etc except for the Agile3 framework.
 
2. NAME SPACES
  - Names spaces must be used starting with "Agile". From there - you append the namespace you are working in followed by the name of the function. For example - upcomming default namescapes are "commons", "ajax", etc...


# Temporary Documentation
=================   CORE  =================
Agile.core.bind(rootEl, vm) - Binding events to the VM
    - rootEl    - Root elementent of the component
    - vm        - The ViewModel / function object
    ** Any element that contains a "click": "functionName" must have a prototype function with a matching function name.
    --- Example ---
    HTML: <button data-bind="click: sendData"></button>
    JS: Agile.components.SomeVM.prototype.sendData = function (e, target) {
            // "e" is the event
            // "target" is the UI element that the function is attached to
        }

initializeComponents() - Attaches all elements that contain a data-component and intializes them to their corresponding component



=================   COMMON  =================
insertHTML(config) - Inserts HTML without rewriting / repainting the DOM / UI
    - config.where  - beforeend, beforestart, afterend, afterstart
    - config.el     - The element that should be affects
    - config.html   - HTML content
    ** Use this when dynamically adding items that need to be bound

isMobile() - Checks if the navigator / browser is a mobile browser

isPWA() - Checks if the window media display is "standalone"

ADD AJAX DOCUMENTATION

=================   EMIT  =================
------------   Emitting data   ------------

To start, add "emit-send" or "emit-receive" to a component's properties. In order for this to work, the receiver must have the function signature already on the object as a prototype function. The "sender" must call Agile.emit.call containing 2 things: the function signature (the name) and the data being passed.

Example:
<div data-component="SearchBar" data-emit-send="textChangedEMIT"></div>
<div data-component="Text" data-emit-receive="textChangedEMIT"></div>

// This is the event that'll cause the data to be emitted
Agile.components.SearchBar.prototype.clickEvent = function (e, target) {
    Agile.emit.call("textChangedEMIT", {"some": "data"});
}

// This is where the emitted data will end up
Agile.components.Text.prototype.textChangedEMIT = function ( data ) {
    // do something with received data
}


=================    FX   =================
typing() - Typing text effect
    - id - Element ID
    - txt - Text to display
    - speed - speed in milliseconds for the delay between letters
    - cb - OPTIONAL callback for after text completion
    - pauseTime - The delay between finishing the text and the callback being executed

    EXAMPLE
    Agile.fx.typing ("test", "Welcome to my test", 50, () => {
        Agile.fx.typing ("test", "Now I'll start typing something new");
    }, 1000);




================= OBSERVE =================
// OBSERVABLE TEXT - make text update the UI automatically
    Creating one
    *  HTML -  <p data-bind="text: variableName"></p>
    *  JS -    self.variableName.set('Value goes here');
    *          After using the setter method - the UI will automatically update with the text. 
    *          ALTERNATIVELY you can pass in an HTML template
    *          OPTIONALLY you can call a callback upon successful setting

// OBSERVABLE CSS - make a CSS class appear conditionally
    Creating one
    *  HTML -  <p data-bind="css: cssClassName"></p>
    *  JS -    self.cssClassName.check(condition);
    *          The check function will check if the value is true. If it is, it will pass apply the class. 
    *          OPTIONALLY you can call a callback if the value is true
    
// OBSERVABLE VARIABLE - allow for a callback function if a variable changes 
    Creating one
    *  HTML -  NONE
    *  JS -    this.variable = new Agile.observable.variable(INITIAL_VALUE, function(){})
    *          Watches for changes to the variable in the setter method. If a change is detected - the callback gets triggered.

// OBSERVABLE ARRAY - allow for a callback function if a variable changes 
    Creating one
    *  HTML -  NONE
    *  JS -    this.variable = new Agile.observable.array(pushFunction(){}, removeFunction(){})
    *          Watches for changes to the array in the push and remove method. If a change is detected - the callback gets triggered.

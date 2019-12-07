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
Check out the DOC.txt for a basic documentation

# Basics - Creating a component
1. Create a new folder in the components folder. Name it the same name as your component. (EX: navbar)
2. create your Less/CSS and your JS files with the same name as the folder (EX: navbar.js & navbar.less). LESS is highly reccomended. If you're adding to the Agile framework component repo - it's required to use LESS.
3. start your CSS off with [data-component="NavBar"] selector so any component with that attribute will have those styles applied to it.
4. In your JS - create the constructor and the render function like so:
```javascript
Agile.components.NavBar = function (root, config) {
    var self = this;
    this.root = root;
    this.config = config;

    self.render();
}

Agile.components.NavBar.prototype.render = function() {
    var self = this;
    
    self.root.innerHTML = `
      markup goes here
    `;
}
```
5. If you need to add interactivity to your elements - add them to the render function like so:
```javascript
Agile.components.NavBar.prototype.render = function() {
    var self = this;

    self.root.innerHTML = `
      <button data-bind="click: clickEventTrigger">Click me</button>
    `;
}

Agile.components.NavBar.prototype.clickEventTrigger = function(event, target) {
  var self = this;

  console.log('button clicked', event, target);
}
```

The data-bind attribute tells the agile binding module to bind specific functionality to that element. It tells it that on "click" to trigger the "clickEventTrigger" function. It passes in the event and the target element that triggered it. You don't have to use only click events, you can pass in any event like you would normally on a "addEventListener" function.

6. To use your component - create a div with the attribute "data-component" equal to the name of your component like how it's spelled in your JS. for example:

```html
<div data-component="NavBar" data-some-property="Hello world"></div>
```

You can also pass in configurations on the component by adding additional data attributes like the data-some-property seen above. Call them in your JS via the this.config property. In this case, it would look like this:

```javascript
console.log(this.config.someProperty);
```

the above code would output "Hello World". This must be called from inside the component though - you can't have any code "floating" around since you wouldn't be able to access it.
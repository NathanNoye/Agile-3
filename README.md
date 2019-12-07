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
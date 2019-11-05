// HOW TO USE THE OBSERVABLE CLASS
// -- Note: The bind object should not be touched. Don't do it. Please. I'll cry. I spent a long time trying to get this to work. I was basically walking in the dark trying to get this to work. So please no. Please.
// OBSERVABLE TEXT - make text update the UI automatically
/** Creating one
    *  HTML -  <p data-bind="text: variableName"></p>
    *  JS -    self.variableName.set('Value goes here');
    *          After using the setter method - the UI will automatically update with the text. 
    *          ALTERNATIVELY you can pass in an HTML template
    *          OPTIONALLY you can call a callback upon successful setting
    * */
// OBSERVABLE CSS - make a CSS class appear conditionally
/** Creating one
    *  HTML -  <p data-bind="css: cssClassName"></p>
    *  JS -    self.cssClassName.check(condition);
    *          The check function will check if the value is true. If it is, it will pass apply the class. 
    *          OPTIONALLY you can call a callback if the value is true
    * */
// OBSERVABLE VARIABLE - allow for a callback function if a variable changes 
/** Creating one
    *  HTML -  NONE
    *  JS -    this.variable = new Agile.observable.variable(INITIAL_VALUE, function(){})
    *          Watches for changes to the variable in the setter method. If a change is detected - the callback gets triggered.
    * */
// OBSERVABLE ARRAY - allow for a callback function if a variable changes 
/** Creating one
    *  HTML -  NONE
    *  JS -    this.variable = new Agile.observable.array(pushFunction(){}, removeFunction(){})
    *          Watches for changes to the array in the push and remove method. If a change is detected - the callback gets triggered.
    * */
// UNDER THE HOOD
/**
* Prototype or regular functions?
* The 'regular' functions are really just appending private members to your component meaning it's local scopped.
* The prototype functions are shared by each of the components but use the 'regular' functions to reference the local scope. 
* This strategy saves memory and load times
* */
Agile.observable = {
    text: function (element) {
        var self = this;
        this.element = element;
        this.initialValue = element.innerHTML;
        this.set = function (value, callback) {
            self.element.innerHTML = value;
            if (callback && typeof callback === "function") {
                callback();
            }
        }
        this.add = function (value, callback) {
            self.element.innerHTML += value + '\n';
            if (callback && typeof callback === "function") {
                callback();
            }
        }
        this.get = function () {
            return self.initialValue;
        }
    },
    class: function (element, cssClass) {
        var self = this;
        this.element = element;
        this.cssClass = cssClass;
        this.check = function (value, callback) {
            if (value === true || value === 'true') {
                self.element.classList.add(self.cssClass);
                if (callback && typeof callback === "function") {
                    callback();
                }
            } else {
                self.element.classList.remove(self.cssClass);
            }
        }
    },
    variable: function (value, callback) {
        var self = this;
        this.initialValue = value || null;
        this.set = function (value) {
            self.initialValue = value;
            if (self.initialValue != null || self.initialValue != value) {
                if (callback && typeof callback === "function") {
                    callback();
                }
            }
        }
        this.get = function () {
            return self.initialValue;
        }
    },
    array: function (add, remove) {
        var self = this;
        this.items = new Array();
        this.push = function (item) {
            this.items.push(item)
            add(item);
        }

        this.remove = function (item) {
            var index = self.items.indexOf(item);
            if (index > -1) {
                self.items.splice(index, 1);
                remove(item)
            } else {
                console.error(`item "${item}" not found in array`)
            }
        }

        this.length = function () {
            return self.items.length;
        }
    },
    attribute : function () {
    
    }
};

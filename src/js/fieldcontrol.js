var FieldControl = function(form, options) {
    var that = this;
    var defaults = {
        initialize: false,
        selector: 'name' 
    }
    that.form = form.jquery ? form[0] : form;
    that.enablers = that.form.querySelectorAll("[data-enable]");
    that.disablers = that.form.querySelectorAll("[data-disable]");
    that.checktypes = ["checkbox", "radio"];
    that.options = (typeof options === "undefined") ? 
                   defaults : 
                   Object.assign(defaults, options);

    that.start(that.enablers, "enable");
    that.start(that.disablers, "disable");
}

FieldControl.prototype.start = function(list, feature) {
    var that = this;
    for (var i = 0; i < list.length; i++) {
        var input = list[i];
        var identifiers = input.getAttribute('data-' + feature).split(" ");
        that.strayHandlers(input, identifiers, feature);
    }
}

FieldControl.prototype.strayHandlers = function(input, identifiers, feature) {
    var that = this,
        eventType = (that.checktypes.indexOf(input.type) > -1) ? "change" : "input";

    addEventHandler(input, eventType, function() { 
      that.handleControl(identifiers, input, feature); 
    });
    if (that.options.initialize) {
      that.handleControl(identifiers, input, feature); 
    }
}

FieldControl.prototype.handleControl = function(identifiers, input, type) {
    var that = this,
        isCheckable = (that.checktypes.indexOf(input.type) > -1),
        conditionMet;

    if (!isCheckable) {
      conditionMet = that.checkCondition(input);
    } else {
      conditionMet = input.checked;
    }

    for (var i = 0; i < identifiers.length; i++) {
        that.updateState(identifiers[i], conditionMet, type);
    }
}

FieldControl.prototype.updateState = function(targetFieldName, result, type) {
    var that = this;
    var targets = that.form.querySelectorAll("["+that.options.selector+"='" + targetFieldName + "']");
    for (var i = 0; i < targets.length; i++) {
        targets[i].disabled = (type == "enable") ? !result : result;
    }
}

FieldControl.prototype.checkCondition = function(input) {
  var that = this;
  var conditionSet = input.getAttribute('data-condition') != null;

  return (conditionSet) ? that.evaluateCondition(input) : input.value != '';
}

FieldControl.prototype.evaluateCondition = function(input) {
    var that = this;
    var matchstr = input.getAttribute('data-condition');
    try {
        var expression = new RegExp(matchstr);
        return expression.test(input.value);
    } catch(e) {
        return input.value == matchstr;
    }
}

function addEventHandler(elem, eventType, handler) {
    if (elem.addEventListener) {
        elem.addEventListener(eventType, handler, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + eventType, handler);
    }
}

// Polyfill from mdn
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) {
    'use strict';
    if (target == null) { 
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { 
        for (var nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}


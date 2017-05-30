var FieldControl = function(form, options) {
    var that = this;
    that.form = form.jquery ? form[0] : form;
    that.enablers = that.form.querySelectorAll("[data-enable]");
    that.disablers = that.form.querySelectorAll("[data-disable]");
    that.checktypes = ["checkbox", "radio"];
    that.options = (typeof options === "undefined") ? {
        enable: true,
        disable: true,
        initialize: false,
        selector: 'name' 
    } : options;

    if (that.options.enable) {
        for (var i = 0; i < that.enablers.length; i++) {
            var input = that.enablers[i];
            var identifiers = input.getAttribute('data-enable').split(" ");
            that.strayHandlers(input, identifiers, "enable");
        }
    }

    if (that.options.disable) {
        for (var i = 0; i < that.disablers.length; i++) {
            var input = that.disablers[i];
            var identifiers = input.getAttribute('data-disable').split(" ");
            that.strayHandlers(input, identifiers, "disable");
        }
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

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
        that.enablers.forEach(function(input) {
            var identifiers = input.dataset.enable.split(" ");
            that.strayHandlers(input, identifiers, "enable");
        })
    }

    if (that.options.disable) {
        that.disablers.forEach(function(input) {
            var identifiers = input.dataset.disable.split(" ");
            that.strayHandlers(input, identifiers, "disable");
        })
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
      conditionMet = typeof input.dataset.condition != 'undefined' ? 
                         input.value == input.dataset.condition : 
                         input.value != '';
    } else {
      conditionMet = input.checked;
    }

    identifiers.forEach(function(targetFieldName) {
        that.updateState(targetFieldName, conditionMet, type);
    })
}

FieldControl.prototype.updateState = function(targetFieldName, result, type) {
    var that = this;
    var targets = that.form.querySelectorAll("["+that.options.selector+"='" + targetFieldName + "']");
    targets.forEach(function(target) {
        target.disabled = (type == "enable") ? !result : result;
    })
}

function addEventHandler(elem, eventType, handler) {
    if (elem.addEventListener) {
        elem.addEventListener(eventType, handler, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + eventType, handler);
    }
}

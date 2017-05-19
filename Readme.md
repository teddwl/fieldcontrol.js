# Fieldcontrol.js
###### form element disabled state control

Fieldcontrol.js allows you to _disable_ or _enable_ html form elements on the clientside in a very simple way.
Changing _almost\_ any form element may en- or disable multiple other elements through the use of `data`-attributes and consistent form input naming.

Check out the [demo](http://fieldcontrol.metheo.io/)

## Setup

#### How to install

##### Use npm

````bash
npm install fieldcontrol.js --save-dev
````
##### Use github / download
clone or [download](https://github.com/teddwl/fieldcontrol.js) the git repository.

````bash
git clone https://github.com/teddwl/fieldcontrol.js.git
````

##### Using the plugin


You only need to include the minified version `./dest/fieldcontrol.min.js`, which is smaller than 1.25kb in size. No dependencies, no jQuery!<br/>
How you style the disabled state of your form elements is up to you, there is a minimial example in the [demo](http://fieldcontrol.metheo.io/).

You are free to include it in the header instead of above the closing `</body>`-tag. Just make sure you call the plugin **after** loading it.

````html
<form id="myForm">
    <!-- fields -->
</form>
<script src="/path/to/fieldcontrol.min.js" type="text/javascript"></script> 
````

Just initialize the plugin passing a `<form/>` DOM-Object. No more javascript needed. You can call the plugin for multiple forms on one page.

````javascript
// one form
var form = document.getElementById("myForm"); // without jQuery
var form = $("#myForm");                      // with jQuery
if (form.length) {
    new FieldControl(form);
}

// or multiple forms
var forms = $(".form"); 
forms.each(function() {
  new FieldControl($(this));
})
````

The constructor has one required parameter, which is the html form DOM-Object. Obviously it doesn't matter if you fetch it by its `id`, tag-type or any other queryselector.

You may also pass a rudimentary `options` object that can deactivate the `enable` or `disable` feature or change the default selector for these features. In general you'll want to stick to the defaults. 

````javascript
var options = {initialize: false, enable: true, disable: true, selector: 'name'};
new FieldControl(formObject, options);
````

I would generally recommended to set the disabled attribute on each field that should initially be disabled, if you can. But if you are dealing with prechecked fields or you simply can not set the disabled attribute because of some lousy templating engine, you can tell fieldcontrol.js to go through your form and it will take care of setting the appropriate disabled states.

## How it works

Fieldcontrol.js is looking for all form elements having a `data-enable` or `data-disable` attribute. It adds an on change listener to those fields and will alter the target inputs' disbled state, depending on the used attributes. The target `name=""` values are set as the `data-enable` or `data-disable` value of the controlling field.

In the first example, that is the case for `input[name="changefield"]`. 

##### simple enable
````html
<input data-enable="changefield" type="checkbox">
<input disabled name="changefield">
````

##### dis- and enable for multiple fields
To en- or disable multiple fields simply concatenate your target input field names with spaces `" "`. 

````html
<input data-enable="changefield changeotherfield" data-disable="otherfield" type="checkbox">
<input disabled name="changefield">
<input disabled name="changeotherfield">
<input name="otherfield">
````
##### enable if a value condition is met

````html
<input data-enable="changefield" type="text" data-condition="matchtext">
<input disabled name="changefield">
````
##### disable if a value condition is met

````html
<input data-disable="changefield" type="text" data-condition="matchtext">
<input name="changefield">
````
##### Do all this with `<select>`-tags

````html
<select name="cities" data-enable="changefield" data-condition="hamburg">
    <option value="newyork">New York</option>
    <option value="paris">Paris</option>
    <option value="hamburg">Hamburg</option>
</select>
<input disabled name='changefield'>
````
Radio buttons are also supported, find more examples in the [demo](http://fieldcontrol.metheo.io/)!
##### use a different selector

Instead of targeting form elements `name` attribute, you can choose any attribute name and pass it via the options object when calling the plugin: 

````javascript
var options = {initialize: false, enable: true, disable: true, selector: 'data-group'};
new FieldControl(formObject, options);
````

The corresponding html:

````html
<input data-enable="changefield changeotherfield" data-disable="otherfield" type="checkbox">
<input disabled name="field1" data-group="changefield">
<input disabled name="field2" data-group="changeotherfield">
<input name="otherfield">
````

The order or nesting of your form fields does not affect how fieldcontrol.js works, so you are free to arrange your form in any way you want.
The FieldControl function though, needs to be called independently for every form you want to use it.

## Features


#### Allowed options:

|  key       | type     |  default value       | What it does                       |
|------------|---------|-----------------------|------------------------------------|
| enable     | boolean | true                  | Enables the `data-enable` feature  |
| disable    | boolean | true                  | Enables the `data-disable` feature |
| initialize | boolean | false                 | defines if the plugin features should run on load * |
| selector   | string  | "name"                | defines what attribute is used to select form elements |


\* if set to true, fieldcontrol.js will go through your form and will set the `disabled` attribute where needed. I recommend using this feature only when dealing with prechecked options. Otherwise setting the appropriate default attributes in your form before rendering it to the client is the way to go.


#### Available attributes

|  attribute       |  expected value                                                           | example |
|------------------|---------------------------------------------------------------------------|---------|
| `data-enable`    | name value(s) of target form elements<br/> to be enabled (seperated by space)  | "fieldname1 fieldname2" |
| `data-disable`   | name value(s) of target form elements<br/> to be disabled (seperated by space) | "fieldname1 fieldname2" |
| `data-condition` | value that should be matched by the<br/> control-input (in general a string or integer, without spaces)* | "shouldmatch" |

\* Regular expressions will be supported in a future update. 


#### Supported tags and attributes:

|  tag                         | attributes                                       |
|------------------------------|--------------------------------------------------|
| `<input type="text" />`      | `data-enable`, `data-disable`, `data-condition`  |
| `<input type="radio" />`     | `data-enable`, `data-disable`                    |
| `<input type="checkbox" />`  | `data-enable`, `data-disable`                    |
| `<select />`                 | `data-enable`, `data-disable`, `data-condition`  |

## outlook

* support regex in `data-condition`
* support multiple inputs controlling one target field

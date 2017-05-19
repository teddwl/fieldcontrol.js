var casper = require('casper').create();
var enableElements, disableElements;

casper.start('http://localhost:3000');

casper.then(function () {
    enableElements =  casper.getElementsInfo("[data-enable]");
    disableElements =  casper.getElementsInfo("[data-disable]");
    this.echo('First Page: ' + this.getTitle());
    this.echo('Enable elments: ' + enableElements.length);
    this.each(enableElements, function(self, link) {
      this.echo(link);
    })
    this.echo('Disable elments: ' + disableElements.length);
    this.each(disableElements, function(self, link) {
      this.echo(link);
    })
});

casper.run();


import $ from 'jquery';

export class DummyClass {
  constructor() {
    this.newElement = $('<div></div>');   // this um variable innerhalb funktion anzusprechen
    $('#map').after(this.newElement);     // neues Div element wird hinzugefügt
    this.newElement.html('Hallo!');
  }

  changeText(newText) {                   // Methode mit neuem Parameter newText
    this.newElement.html(newText);
  }
}
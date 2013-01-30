### Forms-mongoose allows auto-generation of forms from your Mongoose models

http://search.npmjs.org/#/forms-mongoose

### Example

#### Mongoose

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;
var forms = require('forms-mongoose');

var AddressSchema = new Schema({
  category: {type: String, required: true, default: 'home', forms: {all:{}}},
  lines: {type: String, required: true, forms:{all:{widget:forms.widgets.textarea({rows:3})}}},
  city: {type: String, required: true}  
});

var PersonSchema = new Schema({
  email: { type: Email, unique: true, forms: {
    all: {
      type: 'email'
    }
  }},
  confirmed: { type: Boolean, required: true, default: false },
  name: {
    first: { type: String, required: true, forms: {
      new: {},
      edit: {}
    }},
    last: { type: String, required: true, forms: {
      new: {},
      edit: {}
    }}
  },
  address: [AddressSchema]
});

var PersonModel = mongoose.model('Person', PersonSchema);
```

#### Convert Mongoose Model to Forms Object

```javascript
var forms = require('forms-mongoose');

var form = forms.create(PersonModel, 'new'); // Creates a new form for a "new" Person

// Use the form object as you would with Forms

console.log (form.toHTML());
// Note toHTML does not include the <form> tags, this is to allow flexibility.

//optionally create some static methods in the schema

PersonSchema.statics.createForm = function (extra) {
  return forms.create(this, extra);
}

PersonSchema.statics.createAddressForm = function (extra) {
  return forms.create(this.schema.paths.address, extra);
}
```

### Requirements

- [Node.js](http://nodejs.org/)

### Installation

```
npm install forms-mongoose
```



### Forms-mongoose allows auto-generation of forms from your Mongoose models

http://search.npmjs.org/#/forms-mongoose

### Example

#### Mongoose

```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;

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
      edit {}
    }},
    last: { type: String, required: true, forms: {
      new: {},
      edit: {}
    }}
  }
});

var PersonModel = mongoose.model('Person', PersonSchema);
```

#### Convert Mongoose Model to Forms Object

```javascript
var forms = require('forms-mongoose');

var form = forms.create(PersonModel, 'new'); // Creates a new form for a "new" Person

// Use the form object as you would with Forms

console.log (forms.toHTML());
// Note toHTML does not include the <form> tags, this is to allow flexibility.
```

### Requirements

- [Node.js](http://nodejs.org/)

### Installation

```
npm install forms-mongoose
```



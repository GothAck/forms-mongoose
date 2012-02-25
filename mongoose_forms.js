var forms = require('forms')
  , fields = forms.fields
  , validators = forms.validators;

module.exports = function (model) {
  var schema = model.schema
    , tree = schema.tree
    , params = {};

  for (var name in tree) {
    var field = tree[name];
    if (!field.forms_type || field.forms_ignore) continue;
    params[name] = fields[field.forms_type]({
      required: field.required || false
    });
    console.log(params);
  }
  return forms.create(params);
}

module.exports.fields = fields;
module.exports.validators = validators;
module.exports.create = forms.create;

module.exports.bs_iterator = function (name, field) {
  var label = this.label || name[0].toUpperCase() + name.substr(1).replace('_', ' ');
  var html = '<div class="control-group'
    + (field.error ? ' error' : '')
    + '">'
    + '<label class="control-label" for="'+field.id+'">'+label+'</label>'
    + '<div class="controls">'
    + field.widget.toHTML(name, field)
    + (field.error ? '<p class="help-block">' + field.error + '</p>' : '')
    + '</div>'
    + '</div>'
  return html
}

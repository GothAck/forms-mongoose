var forms = require('forms')
  , fields = forms.fields
  , validators = forms.validators;

module.exports.create = function (model) {
  var schema = model.schema
    , paths = schema.paths
    , virtuals = schema.virtuals
    , params = {};
  for (var pathName in paths) {
    var path = paths[pathName];
    if (path.options && path.options.forms_type) {
      params[pathName] = fields[path.options.forms_type]({
        required: path.options.required || path.options.unique
      });
    }
  }
  for (var virtName in virtuals) {
    var virt = virtuals[virtName];
    if (virt.options) {
      if (virt.options.forms_type) {
        params[virtName] = fields[virt.options.forms_type]({
          required: virt.options.forms_required
        });
      }
      if (virt.options.forms_confirm) {
        params[virtName+'.confirm'] = fields[virt.options.forms_type]({
          required: virt.options.forms_required,
          validators: [validators.matchField(virtName)]
        });
      }
    }
  }
  return forms.create(params);
}

module.exports.fields = fields;
module.exports.validators = validators;
module.exports.createForm = forms.create;

module.exports.bs_iterator = function (name, field) {
  var label = this.label || name[0].toUpperCase() + name.substr(1).replace('_', ' ');
  var html = '<div class="control-group'
    + (field.error ? ' error' : '')
    + '">'
    + '<label class="control-label" for="'+(field.id || 'id_'+name)+'">'+label+'</label>'
    + '<div class="controls">'
    + field.widget.toHTML(name, field)
    + (field.error ? '<p class="help-block">' + field.error + '</p>' : '')
    + '</div>'
    + '</div>'
  return html
}

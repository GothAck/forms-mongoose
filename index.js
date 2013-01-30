var forms = require('forms')
  , fields = forms.fields
  , widgets = forms.widgets
  , validators = forms.validators
  , _ = require('underscore');

var _fields = {
  'String': 'string',
  'Number': 'number',
  'Password': 'password',
  'Email': 'email',
  'Date': 'string',
  'Boolean': 'boolean'
}

function convert_mongoose_field(mongoose_field) {
  return fields[_fields[mongoose_field] || fields.string];
}

function get_field(path, form_name, form_category) {
  var _field = null;
  if (!(path.options && path.options.forms))
    return null;
  var forms = path.options.forms;
  if (! (
    forms[form_name] ||
    (forms['all'] && !forms[form_category]) ||
    (forms[form_category] && forms[form_category].all) ||
    (forms[form_category] && forms[form_category][form_name]) ||
    (form_name === '*' && forms._all)
  ))
    return null;

  var _options = _.extend(
      {}
    , forms._all
    , forms.all
    , forms[form_name]
    , form_category && forms[form_category] && forms[form_category]._all
    , form_category && forms[form_category] && forms[form_category].all
    , form_category && forms[form_category] && forms[form_category][form_name]
  );
  
  if (_options.type)
    _field = (typeof _options.type === 'string') ? fields[_options.type] : _options.type
  if (!_field)
    _field = convert_mongoose_field( path.options.type ? path.options.type.name : path.instance );
  if (!_field)
    throw new Error('Model does not have forms.type, probably on a virtual', path);


  var _fields = {}
  _options = _.defaults(_options, {
    required: ( (typeof _options.required === 'undefined') ? (path.options.required || path.options.unique) : _options.required),
    validators: []
  });
  if (path.validators)
    for (var i = path.options.required ? 1 : 0; i < path.validators.length; i ++)
      (function (validator) {
        _options.validators.push(function (form, field, callback) {
          callback(validator[0](field.value) ? undefined : validator[1]);
        });
      })(path.validators[i]);
  _fields[path.path] = null;
  if (_options.confirm) {
    var _options_confirm = _.clone(_options);
    _options_confirm.validators = _options.validators.slice(0)
    _options_confirm.validators.unshift(validators.matchField(path.path));
    _fields[path.path + '.confirm'] = _field(_options_confirm);
  }
  if(_options.existing) {
    var _options_existing = _.clone(_options);
    _options_existing.validators = [function (form, field, callback) {
      if (!form.existing)
        return callback('Server error');
      var existing = form.existing[path.path];
      if (typeof existing === 'function') {
        existing(field.data, function (err, result) {
          if (err) return callback('Server error: ' + err);
          if (!result) return callback('Does not match existing value!!!');
          callback();
        });
      } else if (form.existing[field.name] != field.data) {
          return callback('Does not match existing value!');
      } else {
        callback();
      }
    }];
    _fields[path.path + '.existing'] = _field(_options_existing);
  }
  _options.validators.unshift(function (form, field, callback) {
    if (field.data && _options.confirm)
      form.fields[path.path + '.confirm'].required = true;
    if (field.data && _options.existing)
      form.fields[path.path + '.existing'].required = true;
    callback();
  });
  _fields[path.path] = _field(_options);
  return _fields;
}

module.exports.create = function (model, extra_params, form_name, form_category) {
  var schema = model.schema
    , paths = schema.paths
    , virtuals = schema.virtuals
    , params = {};
  for (var pathName in paths) {
    var path = paths[pathName];
    var field = get_field(path, form_name, form_category);
    if (field)
      params = _.extend(params, field);
  }
  for (var virtName in virtuals) {
    var virt = virtuals[virtName];
    virt.path = virtName;
    var field = get_field(virt, form_name, form_category);
    if (field)
      params = _.extend(params, field);
  }
  params = _.extend({}, params, extra_params);
  var form = forms.create(params);
  return forms.create(params);
}

module.exports.fields = fields;
module.exports.widgets = widgets;
module.exports.validators = validators;
module.exports.createForm = function (params, extra_params) {
  params = _.extend({}, params, extra_params);
  var form = forms.create(params)
  return form;
}

module.exports = [
  { name: 'id', error: 'data_id', type: 'string', required: true},
  { name: 'grant_unit', type: 'string', required: true },
  { name: 'grant_value', type: 'int', required: true },
  { name: 'validity_unit', error: 'data_validity_unit', type: 'string', required: true },
  { name: 'validity_value', error: 'data_validity_value', type: 'int', required: true }
];

module.exports = [
  { name: 'type', error: 'purchase_type', type: 'string', required: true},
  { name: 'recipient', type: 'string', required: true },
  { name: 'open_data', json_file: 'data', type: 'json', required: false },
  { name: 'smart_data', json_file: 'data', type: 'json', required: false },
  { name: 'amount', type: 'json', required: true },
  { name: 'description', type: 'string', required: false }
];

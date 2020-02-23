module.exports = [
  { name: 'type', error: 'topup_type', type: 'string', required: true},
  { name: 'recipient', type: 'string', required: true },
  { name: 'amount', type: 'json', required: true },
  { name: 'validity', type: 'json', required: false },
  { name: 'description', type: 'string', required: false }
];

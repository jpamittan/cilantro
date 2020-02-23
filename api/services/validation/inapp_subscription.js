module.exports = [
  { name: 'id', type: 'string', required: true},
  { name: 'subscription_id', type: 'string', required: true},
  { name: 'subscription_type', type: 'string', required: true},
  { name: 'amount', type: 'string', required: true},
  { name: 'currency', type: 'string', required: true},
  { name: 'transaction_id', type: 'string', required: true},
  { name: 'os', type: 'string', values: ['android', 'ios'], required: true},
  { name: 'months', type: 'string', required: false},
];

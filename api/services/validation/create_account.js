module.exports = [
  { name: 'id', type: 'string', required: true },
  { name: 'picture', type: 'string', required: false },
  { name: 'first_name', type: 'name', required: true, min_length: 1, max_length: 30 },
  { name: 'middle_name', type: 'name', required: false, min_length: 1, max_length: 30 },
  { name: 'last_name', type: 'name', required: true, min_length: 1, max_length: 30 },
  { name: 'email', type: 'email', required: false},
  { name: 'device_token', type: 'string', required: false},
  { name: 'os', type: 'string', values: ['android', 'ios'], required: false}
];

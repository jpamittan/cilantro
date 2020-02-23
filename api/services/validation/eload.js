module.exports = [
  { name: 'id', type: 'string', required: true },
  { name: 'msisdn', type: 'numeric', min_length: 10, max_length: 10, required: true },
  { name: 'product_code', type: 'string', required: true },
  { name: 'eload_type', type: 'string', required: true },
];

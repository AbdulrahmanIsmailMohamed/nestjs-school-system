// console.log(Math.floor(100000 + Math.random() * 900000).toString());
const crypto = require('crypto');

const resetCode = 'your_reset_code_here';

const hashCode = crypto.createHash('sha256').update(resetCode).digest('hex');

console.log(hashCode); // or do something with the hash code

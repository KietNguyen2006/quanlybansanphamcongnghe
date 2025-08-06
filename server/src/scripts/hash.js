// Script: node src/scripts/hash.js <password>
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Vui lòng nhập mật khẩu cần hash!');
  process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
  console.log('HASH:', hash);
}); 
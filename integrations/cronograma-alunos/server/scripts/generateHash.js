const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'Admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash para senha "Admin123":');
  console.log(hash);
}

hashPassword();
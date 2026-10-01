const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log('ENV LOADED:', process.env.MONGODB_URI, 'PORT:', process.env.PORT);

try {
  require('./dist/main.js');
} catch (e) {
  console.error('SERVER FATAL ERROR:', e);
}

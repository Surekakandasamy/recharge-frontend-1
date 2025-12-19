const app = require('./backend/src/app');
const connectDB = require('./backend/src/config/db');
const { seedAll } = require('./backend/src/utils/seedData');

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  await seedAll();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
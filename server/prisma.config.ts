module.exports = {
  datasource: {
    provider: 'sqlite',
    url: process.env.DB_URL || 'file:./prisma/dev.db',
  },
};

export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-me',
    refreshExpiresIn: '7d',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
});

export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT || '3001', 10),
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'semapa',
    password: process.env.DB_PASSWORD || 'semapa123',
    database: process.env.DB_DATABASE || 'semapa_demo_db',
  },
});

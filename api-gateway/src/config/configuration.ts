export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT || '3000', 10),
  },
  services: {
    catalogos: process.env.MS_CATALOGOS_URL || 'http://ms-catalogos:3001',
    lecturas: process.env.MS_LECTURAS_URL || 'http://ms-lecturas:3002',
  },
});

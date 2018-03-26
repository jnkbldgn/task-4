const config = {
  development: {
    isProd: false,
    isDev: true,
  },
  production: {
    isProd: true,
    isDev: false,
  },
  default: {
    dateFormat: 'DD-MMM-YYYY HH:mm',
    port: process.env.PORT || '8080',
    host: '0.0.0.0',
    repoPath: '/repo/',
  },
};

exports.getConfig = env => Object.assign(config[env], config.default);

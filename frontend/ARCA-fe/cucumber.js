module.exports = {
  default: {
    paths: ['src/features/**/*.feature'],
    require: ['src/features/step-definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress', 'html:cucumber-reports/report.html'],
  },
};

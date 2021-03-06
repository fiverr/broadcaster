module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/shipit_workspace',
      deployTo: '/home/admin/apps/broadcaster',
      repositoryUrl: 'git@github.com:fiverr/broadcaster.git',
      updateSubmodules: true,
      ignores: ['.git', 'node_modules'],
      branch: process.env.BRANCH || 'master',
      timestamp: process.env.TIMESTAMP,
      keepReleases: 10,
      shallowClone: true,
      strict: 'no',
      shared: {
        dirs: [ 'node_modules', 'logs', 'run' ],
        overwrite: true
      }
    },
    production: {
      servers: process.env.SERVER_LIST.split(" ")
    }
  });

function underRelease(cmd) {
    return 'cd ' + shipit.config.deployTo + "/current " + ' && ' + cmd;
  }

shipit.blTask('startAppProduction', function () {
        shipit.remote(underRelease("./control.sh restart production"));
  });

  shipit.blTask('deployProduction', function () {
    shipit.start('startAppProduction');
   });

shipit.on("cleaned", function() {
        if (shipit.environment.indexOf("staging") > -1) {
                shipit.start('deployStaging');
        } else if (shipit.environment.indexOf("production") > -1) {
                shipit.start('deployProduction');
        }
});
};

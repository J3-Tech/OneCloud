var vorpal = require('vorpal')();
var config = require('./config.json');
var Dropbox = require('dropbox');
var recursive = require('recursive-readdir');
var upath = require('upath');

vorpal
    .command('info', 'get defined cloud services\' informations')
    .action(function(args, callback) {

    });

vorpal
    .command('cp <source> <destination>', 'copy file/directory to defined cloud')
    .option('-d, --directory', 'Directory to move to cloud services')
    .action(function(args, callback) {
        /*dbx.usersGetSpaceUsage()
        .then(function(r){
            console.log(r);
        })*/
        var dbx = new Dropbox({ accessToken: config.services.dropbox[0].accessToken });
        recursive(args.source, function (err, files) {
            files.forEach(function(file){
                dbx.filesUpload({
                  autorename: false,
                  contents: 'test',
                  path: args.destination + upath.toUnix(file)
                })
                .then(function(response) {
                    console.log(response);
                })
                .catch(function(error) {
                    console.log(error);
                });
            });
        });
    });

vorpal
    .command('mv', 'move file/directory to defined cloud')
    .option('-d, --directory', 'Directory to move to cloud services')
    .action(function(args, callback){
        callback();
    });

vorpal
    .delimiter('one-cloud$')
    .show();

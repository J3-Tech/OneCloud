var vorpal = require('vorpal')();
var config = require('./config.json');
var Dropbox = require('dropbox');
var recursive = require('recursive-readdir');
var upath = require('upath');
var jsonfile = require('jsonfile')
const fs = require('fs');
var log = 'mapping.json'

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
        vorpal.log('Copy files');
        var entries = [];
        var dbx = new Dropbox({ accessToken: config.services.dropbox[0].accessToken });
        recursive(args.source, function (err, files) {
            files.forEach(function(file){
                fs.readFile(file, function(err, data) {
                    dbx.filesUpload({
                        autorename: false,
                        contents: data,
                        path: args.destination + upath.toUnix(file),
                        mode: {
                            '.tag': 'overwrite'
                        }
                    })
                    .then(function(response) {
                        vorpal.log(file + ' uploaded');
                    })
                    .catch(function(error) {
                        vorpal.log(error);
                    });
                });
            });
        });
        callback();
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

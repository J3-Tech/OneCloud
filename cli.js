var vorpal = require('vorpal')();
var config = require('./config.json');
var recursive = require('recursive-readdir');
var upath = require('upath');
var jsonfile = require('jsonfile');
var Dropbox = require('dropbox');
var Database = require('./utils/Database.js');
var model = require('./model');
const fs = require('fs');
var log = 'mapping.json';

vorpal.history('one-cloud');

vorpal
    .command('info', 'get defined cloud services\' informations')
    .action(function(args, callback) {
        callback();
    });

vorpal
    .command('space', 'show space details')
    .action(function(args, callback){
        callback();
    });

vorpal
    .command('init', 'init')
    .action(function(args, callback){
        model.File.sync({ force: true });
        model.Service.sync({ force: true });
        callback();
    });

vorpal
    .command('create-index <source>', 'create file index')
    .alias('ci')
    .action(function(args, callback){
        recursive(args.source, function (err, files) {
            model.File.sync({force: true}).then(function () {
                files.forEach(function(file){
                  return model.File.create({
                    name: upath.toUnix(file)
                  });
                });
            });
        });
        callback();
    });

vorpal
    .command('upload <source> <destination>', 'upload file/directory to defined cloud')
    .action(function(args, callback) {
        vorpal.log('Copy files');
        var entries = [];
        var dbx = new Dropbox({ accessToken: config.services.dropbox[0].accessToken });
        model.File.findAll({
            where: {
                service: null
            },
            limit: 10
        }).then(function(files){
            files.forEach(function(file){
                fs.readFile(file.name, function(err, data){
                    dbx.filesUpload({
                        autorename: false,
                        contents: data,
                        path: '/' + upath.toUnix(file.name),
                        mode: {
                            '.tag': 'overwrite'
                        }
                    })
                    .then(function(response) {
                        vorpal.log(file + ' uploaded');
                        model.File.update({
                            service: 'dropbox'
                        },{
                            where: {
                                id: file.id
                            }
                        });
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

'use strict';

var Client = require('dropbox');

class Dropbox{

    constructor() {
        this._client = new Client();
    }

    space() {
        this._client.usersGetSpaceUsage()
        .then(function(r){
            console.log(r);
        })
    }

    upload(destination, file) {
        this._client.filesUpload({
            autorename: false,
            contents: data,
            path: destination + upath.toUnix(file),
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
    }
}

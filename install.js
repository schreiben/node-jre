/* Copyright (C) 2016 Tilman Kamp
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

const os = require('os');
const fs = require('fs');
const request = require('request');;
const ProgressBar = require('progress');

request
  .get({
    url: 'https://download.oracle.com/otn-pub/java/jdk/8u102-b14/jre-8u102-macosx-x64.tar.gz',
    rejectUnauthorized: false,
    headers: {
      'Cookie': 'gpw_e24=http://www.oracle.com/; oraclelicense=accept-securebackup-cookie'
    }
  })
  .on('response', res => {
    var len = parseInt(res.headers['content-length'], 10);
    var bar = new ProgressBar('  downloading [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: len
    });
    res.on('data', chunk => bar.tick(chunk.length));
    res.on('end', () => console.log('\n'));
  })
  .on('error', err => console.log(`problem with request: ${err.message}`))
  .pipe(fs.createWriteStream('jre.tar.gz'));

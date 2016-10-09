/* Copyright (C) 2016 Tilman Kamp
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const rmdir = require('rmdir');
const zlib = require('zlib');
const tar = require('tar-fs');
const request = require('request');
const ProgressBar = require('progress');

const JRE_PATH = path.join(process.cwd(), 'jre');

rmdir(JRE_PATH);

req = request
  .get({
    url: 'https://download.oracle.com/otn-pub/java/jdk/8u102-b14/jre-8u102-macosx-x64.tar.gz',
    rejectUnauthorized: false,
    headers: {
      'Cookie': 'gpw_e24=http://www.oracle.com/; oraclelicense=accept-securebackup-cookie'
    }
  })
  .on('response', res => {
    var len = parseInt(res.headers['content-length'], 10);
    var bar = new ProgressBar('  downloading and preparing JRE [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 80,
      total: len
    });
    res.on('data', chunk => bar.tick(chunk.length))
  })
  .on('error', err => console.log(`problem with request: ${err.message}`))
  .on('end', () => console.log('\n'))
  .pipe(zlib.createUnzip())
  .pipe(tar.extract(JRE_PATH));

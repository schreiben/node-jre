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
const process = require('process');
const request = require('request');
const ProgressBar = require('progress');

const JRE_PATH = path.join(process.cwd(), 'jre');

const fail = reason => {
  console.error(reason);
  process.exit(1);
};

var arch = os.arch();
switch (arch) {
  case 'x64': break;
  case 'ia32': arch = 'i586'; break;
  default:
    fail('unsupported architecture: ' + arch);
}

var platform = os.platform();

var driver;
switch (platform) {
  case 'darwin': platform = 'macosx'; driver = ['Contents', 'Home', 'bin', 'java']; break;
  case 'win32': platform = 'windows'; driver = ['bin', 'javaw.exe']; break;
  case 'linux': driver = ['bin', 'java']; break;
  default:
    fail('unsupported platform: ' + platform);
}

const getDirectories = dirPath => fs.readdirSync(dirPath).filter(
  file => fs.statSync(path.join(dirPath, file)).isDirectory()
);

const major_version = 8;
const update_number = 102;
const build_number = 14;
const version = major_version + 'u' + update_number;

rmdir(JRE_PATH);

req = request
  .get({
    url: 'https://download.oracle.com/otn-pub/java/jdk/' +
      version + '-b' + build_number +
      '/jre-' + version + '-' + platform + '-' + arch + '.tar.gz',
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
  .on('end', () => {
    var jreDir = path.resolve('jre');
    var jreDirs = getDirectories(jreDir);
    if (jreDirs.length < 1)
      fail('no jre found in archive');
    driver.unshift(jreDirs[0]);
    driver.unshift(jreDir);
    driver = path.join.apply(path, driver);
    console.log(driver);
  })
  .pipe(zlib.createUnzip())
  .pipe(tar.extract(JRE_PATH));

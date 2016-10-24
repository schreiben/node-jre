/* MIT License
 *
 * Copyright (c) 2016 schreiben
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 "use strict";

(function(){

  const os = require('os');
  const fs = require('fs');
  const path = require('path');
  const rmdir = require('rmdir');
  const zlib = require('zlib');
  const tar = require('tar-fs');
  const process = require('process');
  const request = require('request');
  const ProgressBar = require('progress');
  const child_process = require('child_process');

  const fail = reason => {
    console.error(reason);
    process.exit(1);
  };

  var _arch = os.arch();
  switch (_arch) {
    case 'x64': break;
    case 'ia32': _arch = 'i586'; break;
    default:
      fail('unsupported architecture: ' + _arch);
  }
  const arch = exports.arch = () => _arch;

  var _platform = os.platform();
  var _driver;
  switch (_platform) {
    case 'darwin': _platform = 'macosx'; _driver = ['Contents', 'Home', 'bin', 'java']; break;
    case 'win32': _platform = 'windows'; _driver = ['bin', 'javaw.exe']; break;
    case 'linux': _driver = ['bin', 'java']; break;
    default:
      fail('unsupported platform: ' + _platform);
  }
  const platform = exports.platform = () => _platform;

  const getDirectories = dirPath => fs.readdirSync(dirPath).filter(
    file => fs.statSync(path.join(dirPath, file)).isDirectory()
  );

  const major_version = 8;
  const update_number = 102;
  const build_number = 14;
  const version = major_version + 'u' + update_number;

  const jreDir = exports.jreDir = () => path.join(path.resolve('.'), 'jre');

  const driver = exports.driver = () => {
    var jreDirs = getDirectories(jreDir());
    if (jreDirs.length < 1)
      fail('no jre found in archive');
    var d = _driver.slice();
    d.unshift(jreDirs[0]);
    d.unshift(jreDir());
    return path.join.apply(path, d);
  };

  const url = exports.url = () =>
    'https://download.oracle.com/otn-pub/java/jdk/' +
    version + '-b' + build_number +
    '/jre-' + version + '-' + platform() + '-' + arch() + '.tar.gz';

  const smoketest = exports.smoketest = () =>
    child_process.execSync(
      driver() + ' -cp resources Smoketest',
      { encoding: 'utf8' }
    ).trim() === 'No smoke!';

  const install = exports.install = callback => {
    callback = callback || () => {};
    rmdir(jreDir());
    request
      .get({
        url: url(),
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
        res.on('data', chunk => bar.tick(chunk.length));
      })
      .on('error', err => {
        console.log(`problem with request: ${err.message}`);
        callback(err);
      })
      .on('end', () => { if (smoketest()) callback(); else callback("Smoketest failed."); })
      .pipe(zlib.createUnzip())
      .pipe(tar.extract(jreDir()));
  };

})();

# node-jre

[![Build Status](https://ci.appveyor.com/api/projects/status/github/schreiben/node-jre?svg=true)](https://ci.appveyor.com/project/tilmankamp/node-jre)
[![Build Status](https://travis-ci.org/schreiben/node-jre.svg?branch=master)](https://travis-ci.org/schreiben/node-jre)
[![npm version](https://badge.fury.io/js/node-jre.svg)](https://www.npmjs.com/package/node-jre)

This module will embed the Java Runtime Environment (JRE) into a Node.js app.
It will download the platform specific JRE at installation time.
Afterwards the embedding app can be bundled into a platform specific package.
This package would not require any further JRE installation steps by users.

## Install

```bash
npm install --save node-jre
```

## Usage

In this example we will run the a Java class-file at the relative path
`java/Hello.class`. It's source code `java/Hello.java` would look like this:

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, " + args[0] + "!");
    }
}
```

You can compile it with something like this:
```bash
javac java/Hello.java
```

By running the following file you should get `true` as output.

```javascript
var jre = require('node-jre');

var output = jre.spawnSync(  // call synchronously
    ['java'],                // add the relative directory 'java' to the class-path
    'Hello',                 // call main routine in class 'Hello'
    ['World'],               // pass 'World' as only parameter
    { encoding: 'utf8' }     // encode output as string
  ).stdout.trim();           // take output from stdout as trimmed String

console.log(output === 'Hello, World!'); // Should print 'true'
```

## API

`jre.install([callback])` Downloads and prepares a Java Runtime Engine (JRE). It is automatically called during module installation.
- `callback` (function(error)). Will be called when installation is finished. In case of any problems, `error` will be defined and contain a description.

`jre.spawn(classpath, classname[, args][, options])` Spawns a new child process by running the main method of a given Java class. This is a wrapper around [child_process.spawn]. Please look there for further documentation.
- `classpath` (array of strings). Paths to `.jar` files or directories containing `.class`files.
- `classname` (string). The Java class to run.
- `args` (array of strings).
  The command line arguments that are to be passed to the Java class's main method.
  Same as in [child_process.spawn].
- `options` (object). Options that are passed to [child_process.spawn].
- Returns an object of the type [child_process.ChildProcess].
[child_process.spawn]: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
[child_process.ChildProcess]: https://nodejs.org/api/child_process.html#child_process_class_childprocess


`jre.spawnSync(classpath, classname[, args][, options])` Synchronously spawns a new child process by running the main method of a given Java class. The command will not return until the spawned process ends. This is a wrapper around [child_process.spawnSync]. Please look there for further documentation.
- `classpath` (array of strings). Paths to `.jar` files or directories containing `.class`files.
- `classname` (string). The Java class to run.
- `args` (array of strings).
  The command line arguments that are to be passed to the Java class's main method.
  Same as in [child_process.spawnSync].
- `options` (object). Options that are passed to [child_process.spawnSync].
- Returns a result object as in [child_process.spawnSync].
[child_process.spawnSync]: https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options

## License
MIT License

Copyright (c) 2016 schreiben

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

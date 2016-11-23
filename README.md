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

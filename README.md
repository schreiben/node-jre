# node-jre

[![Build Status](https://ci.appveyor.com/api/projects/status/github/schreiben/node-jre?svg=true)](https://ci.appveyor.com/project/tilmankamp/node-jre)
[![Build Status](https://travis-ci.org/schreiben/node-jre.svg?branch=master)](https://travis-ci.org/schreiben/node-jre)

This module will embed the Java Runtime Environment into a Node.js app.
It will download the platform specific JRE at installation time.
Afterwards the embedding app can be bundled into a platform specific package.
This package would not require any further JRE installation steps by users.

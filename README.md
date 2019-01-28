[![moxb Logo](https://dl.dropboxusercontent.com/s/6w24mniyvlvij0s/moxb_logo_github.png?dl=0)](http://moxb.org/)

  moxb is a modular, opinionated [Typescript](http://www.typescriptlang.org/) framework for architecting large scale web application with [React](https://reactjs.org/) and [mobx](https://mobx.js.org/).
  moxb [/(mox) (b)/] stands for **mox** [latin for *just*] and **b** [*binding*] which describes the core of the framework. It creates loosely coupled binding between different frameworks or libraries with a set of different architectural patterns, to create lean modern web applications. 

see [ChangeLog](./ChangeLog.md)


### How to ship a new version

- in the top level `package.json` update the version (it's not done by lerna)
  - make sure that `package-lock.json` is up to date
- commit all changes
- call `make` 
- `. ./admin/activate`
- `lerna publish`

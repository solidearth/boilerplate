## App boilerplate

Boilerplate client-side

***

### Installation

1. Clone the repo
2. `npm install`
3. `bower install`


### Development 

1. `gulp watch`

### Build

1. `gulp build`

Building will auto-increment the semver 'patch' value on package.json and bower.json files. To update minor or major values, you can use flags:

- `gulp build --bump=minor`, ie. 1.__1__.0
- `gulp build --bump=major`, ie. __2__.0.0
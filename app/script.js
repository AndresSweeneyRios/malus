const fs = require('fs')

const components = {}

for (const component of fs.readdirSync('app/components'))
    components[component.replace('.js','')] = new Vue(require('./components/' + component))
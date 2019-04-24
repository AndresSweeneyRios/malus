const components = {}

for (const component of ['main', 'title-bar'])
    components[component] = new Vue(require('./components/' + component))
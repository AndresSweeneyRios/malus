const mapper = require('nat-upnp-wrapper')
const electron = require('electron');
const remote = electron.remote

const main = new Vue({
    el: '#main',
    data: { 
        ports: []
    }
})

const refresh = (local=true) => mapper.mappings(local).then(data => {
    if (data.success) main.ports = data.results
    else throw data.err
})

refresh()

window.onclick = e => {
    const window = remote.getCurrentWindow();

    switch (e.target.id) {
        case 'tb-exit':
            window.close()
        break;
        case 'tb-max':
            window.isMaximized() ? window.unmaximize() : window.maximize()
        break;
        case 'tb-min':
            window.minimize()
        break;
    }

    switch (e.target.className) {
        case 'port':
        case 'port selected':
            const key = e.target.children[2].innerText
            main.ports[key].selected ? main.ports[key].selected = false : main.ports[key].selected = true
            main.$forceUpdate()
        break;
    }
}
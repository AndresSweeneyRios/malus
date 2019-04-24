const electron = require('electron'), remote = electron.remote, chokidar = require('chokidar')

module.exports = {
    el: '#title-bar',

    data: {
        window: remote.getCurrentWindow(),
        maximized: remote.getCurrentWindow().isMaximized()
    },

    mounted () {
        window.window.addEventListener('keydown', e => {
            switch (e.key.toLowerCase()) {
                case 'f12': 
                    this.window.openDevTools()
                    break

                case 'j': 
                case 'i': 
                    if (e.ctrlKey && e.shiftKey) this.window.openDevTools()
                    break

                case 'f5': 
                    this.window.reload() 
                    break
                    
                case 'r':
                    if (e.ctrlKey) this.window.reload()
                    break
            }
        })
        
        if (process.env.DEV) chokidar.watch('app').on('change', this.window.reload)

        this.window.on('maximize', () => {
            Vue.set(this, 'maximized', true)
        })

        this.window.on('unmaximize', () => {
            Vue.set(this, 'maximized', false)
        })
    }
}
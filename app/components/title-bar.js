const electron = require('electron'), remote = electron.remote

module.exports = {
    el: '#title-bar',

    computed: {
        window: remote.getCurrentWindow
    },

    mounted () {
        window.onkeydown = e => {
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
        }
    }
}
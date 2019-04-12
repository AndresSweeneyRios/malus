const mapper = require('nat-upnp-wrapper'), electron = require('electron'), remote = electron.remote

new Vue({
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
})

new Vue({
    el: '#main',

    data: { 
        ports: {},
        adding: false,
        refreshing: false
    },

    methods: {
        cancel () {
            this.adding = false
        },

        async refresh (local=true) {
            this.refreshing = true

            this.ports = []

            const data = await mapper.mappings(local)

            if ( data.success ) for (const {private: {host, port}} of data.results) {
                this.ports[host] = this.ports[host] || []
                this.ports[host].push(port)
            }

            else console.error(data.err)

            this.$forceUpdate()

            this.refreshing = false
        }
    },

    mounted () {
        this.refresh()
    }
})
const  mapper = require('nat-upnp-wrapper')

module.exports = {
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
}
const mapper = require('nat-upnp-wrapper')

module.exports = {
    el: '#main',

    data: { 
        ports: {},
        changes: {},
        adding: false,
        refreshing: false,
        changeLength: 0
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
        },

        async edit ({event, host, port}) {
            const {value} = event.target

            this.changes[host] = this.changes[host] || {}

            this.changes[host][port] = {
                index: this.ports[host].indexOf(port),
                value
            }

            this.changeLength = Object.keys(this.changes).length

            this.$nextTick(() => {
                event.target.value = value
            })
        },

        async save () {
            for (const host of Object.keys(this.changes)) {
                mapper.unmap({
                    ports: this.ports[host]
                })

                for (const port of Object.keys(this.changes[host])) {
                    const {index, value} = this.changes[host][port]
                    this.ports[host][index] = Number(value)
                }

                delete this.changes[host]

                mapper.map({
                    ports: this.ports[host]
                })
            }
        }
    },

    mounted () {
        this.refresh()
    }
}
const mapper = require('nat-upnp-wrapper')

module.exports = {
    el: '#main',

    data: {
        oldPorts: [],
        ports: [],
        port: 80, // this is for the input in the "add port" form, couldn't think of a better name
        edits: [],
        additions: [],
        deletions: [],
        host: '127.0.0.1',
        adding: false,
        refreshing: false,
        saving: false
    },

    methods: {
        cancel () {
            this.adding = false
        },

        async refresh ( local = true /* only find mappings for local device */ ) {
            this.refreshing = true

            this.ports = []

            const data = await mapper.mappings(local)

            if ( data.success ) for (const {private: {host, port}} of data.results) {
                this.ports.push(port)
                Vue.set(this, 'host', host)
            } else console.error(data.err)

            this.oldPorts = this.ports.slice(0) // clone array, this is to differentiate ports while editing

            this.refreshing = false
        },

        async edit ({event, index}) {
            const {value} = event.target, port = {index, value}

            if (value !== this.oldPorts[index]) this.edits.push(port)
            else if (this.edits.indexOf(port) > -1) this.edits.splice(this.edits.indexOf(port), 1)
        },

        async remove ({ports}) {
            for (const {port, index} of ports) {
                this.ports.splice(index, 1)
                this.deletions.push(port)
            }
        },

        async save () {
            this.saving = true

            const unmaps = [], maps = []
            
            for (const key in this.edits) {
                const {index, value} = this.edits[key]

                unmaps.push(this.oldPorts[index])
                
                maps.push(value)

                Vue.set(this.ports, index, Number(value))
            }

            maps.push(...this.additions)
            unmaps.push(...this.deletions)

            Object.assign(this, {
                edits: [],
                additions: [],
                deletions: []
            })

            try {
        
                if (maps.length > 0) await mapper.map({
                    ports: maps
                })

                if (unmaps.length > 0) await mapper.unmap({
                    ports: unmaps
                })
                    
                this.oldPorts = this.ports.slice(0)
            } catch (error) {
                throw error
            }

            this.saving = false
        },

        async add ({ports}) {
            for (const port of ports) {
                this.additions.push(port)
                this.ports.push(port)
            }
        }
    },

    mounted () {
        this.refresh()
        
        window.window.addEventListener('keydown', e => {
            switch (e.key.toLowerCase()) {
                case 's':
                    if (e.ctrlKey) this.save()
                    break
            }
        })
    }
}
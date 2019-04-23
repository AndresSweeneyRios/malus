const express = require('express')().get('/',(req,res) => res.send('hello world')).listen(80)

console.log('Listening on port 80.')
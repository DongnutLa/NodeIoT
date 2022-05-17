<template>
  <div>
<!--     <agent 
      uuid="81dc4175-bb23-4cbe-bc98-d2849e93f207"
      :socket="socket"></agent> -->
    <agent
      v-for="agent in agents"
      :uuid="agent.uuid"
      :key="agent.uuid"
      :socket="socket">
    </agent>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<style>
  body {
    font-family: Arial;
    background: #f8f8f8;
    margin: 0;
  }
</style>

<script>
const io = require('socket.io-client')
const socket = io()
const axios = require('axios')
const { serverHost } = require('../config')

module.exports = {
  data () {
    return {
      agents: [],
      error: null,
      socket
    }
  },

  mounted () {
    this.initialize()
  },

  methods: {
    async initialize () {
      let agents
      try {
        agents = await axios.get(`${serverHost}/agents`)
      } catch (error) {
        this.error = error.error.error
        return
      }

      this.agents = agents.data

      socket.on('agent/connected', payload => {
        const { uuid } = payload.agent
        const existing = this.agents.find(a => a.uuid === uuid)
        if (!existing) {
          this.agents.push(payload.agent)
        }
      })
    }
  }
}
</script>
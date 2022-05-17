'use strict'

const express = require('express')
const axios = require('axios')

const api = express.Router()

const { endpoint, apiToken } = require('./config')

api.get('/agents', async (req, res, next) => {
  try {
    var agents = await axios.get(`${endpoint}/api/agents`, {'Authorization': `Bearer ${apiToken}`})
  } catch (error) {
    return next(error)
  }

  res.send(agents.data)
})

api.get('/agent/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  try {
    var agent = await axios.get(`${endpoint}/api/agent/${uuid}`, {'Authorization': `Bearer ${apiToken}`})
  } catch (error) {
    return next(error)
  }

  res.send(agent.data)
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  try {
    var metrics = await axios.get(`${endpoint}/api/metrics/${uuid}`, {'Authorization': `Bearer ${apiToken}`})
  } catch (error) {
    return next(error)
  }

  res.send(metrics.data)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params
  try {
    var metrics = await axios.get(`${endpoint}/api/metrics/${uuid}/${type}`, {'Authorization': `Bearer ${apiToken}`})
  } catch (error) {
    return next(error)
  }

  res.send(metrics.data)
})

module.exports = api
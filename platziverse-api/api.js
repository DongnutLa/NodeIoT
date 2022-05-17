'use strict'

const debug = require('debug')('platziverse:api:routes')
const express = require('express')
const { expressjwt: auth } = require('express-jwt')
const guard = require('express-jwt-permissions')()
const db = require('platziverse-db')

const config = require('./config')

const api = express.Router()

let services, Agent, Metric

api.use('*', async (req, res, next) => {
  if(!services) {
    debug('Connecting to database')
    try {
      services = await db(config.db)
    } catch (error) {
      next(error)
    }
    Agent = services.Agent
    Metric = services.Metric
  }
  next()
})

api.get('/agents', 
//auth({secret: config.auth.secret, algorithms: ["HS256"]}), 
async (req, res, next) => {
  debug('A request has come to /agents')

  const { auth } = req

  /* if (!auth || !auth.username) {
    return next(new Error('Not Authorized'))
  } */

  let agents = []
  try {
    //if(auth.admin) {
      agents = await Agent.findConnected()
    /* } else {
      agents = await Agent.findByUsername(auth.username)
    } */
  } catch (error) {
    return next(error)
  }

  res.send(agents)
})

api.get('/agent/:uuid',
//auth({secret: config.auth.secret, algorithms: ["HS256"]}),
//guard.check("auth",["metrics:read"]),
async (req, res, next) => {
  const { uuid } = req.params

  debug(`Request to /agent/${uuid}`)

  let agent
  try {
    agent = await Agent.findByUuid(uuid)
  } catch (error) {
    return next(error)
  }

  if(!agent) {
    return next(new Error(`Agent not found with uuid: ${uuid}`))
  }
  res.send(agent)
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params

  debug(`request to /metrics/${uuid}`)

  let metrics = []
  try {
    metrics = await Metric.findByAgentUuid(uuid)
  } catch (error) {
    return next(error)
  }

  if(!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid}`))
  }

  res.send(metrics)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params

  debug(`Request to /metrics/${uuid}/${type} `)

  let metrics = []

  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid)
  } catch (error) {
    return next(error)
  }

  if(!metrics || metrics.length === 0) {
    return next(new Error(`Metrics ${type} not found for agent with uuid ${uuid}`))
  }

  res.send(metrics)
})

module.exports = api
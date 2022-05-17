'use strict'

const test = require('ava')
const util = require('util')
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const agentFixtures = require('./fixtures/agent')
const auth = require('../auth')
const config = require('../config')
const sign = util.promisify(auth.sign)

let sandbox = null
let server = null
let dbStub = null
let token = null
let AgentStub = {}
let MetricStub = {}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  dbStub = sandbox.stub()
  dbStub.returns(Promise.resolve({
    Agent: AgentStub,
    Metric: MetricStub
  }))

  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected))

  token = await sign({ admin: true, username: 'platzi' }, config.auth.secret)

  const api = proxyquire('../api', {
    'platziverse-db': dbStub
  })

  server = proxyquire('../server', {
    './api': api
  })
})

test.afterEach(() => {
  sandbox && sinon.restore()
})

test.serial('/api/agents', async t => {
  const res = await request(server)
    .get('/api/agents')
    .set('Authorization', `Bearer ${token}`)

    let body = JSON.stringify(res.body)
    let expected = JSON.stringify(agentFixtures.connected)

    t.regex(res.headers['content-type'], /json/, 'response Content Type should be json type')
    t.deepEqual(res.statusCode, 200, 'response status code should be 200')
    t.deepEqual(body, expected, 'response body should be the expected')
})
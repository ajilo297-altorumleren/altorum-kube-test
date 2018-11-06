var request = require('supertest');
var app = require('../index.js');

describe('GET /', () => {
    it('respond with some text', (done) => {
        request(app).get('/').expect('Altorum Kubernetes Test', done);
    });
});
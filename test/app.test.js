const nock = require('nock');

const expect = require('chai').expect;
const chai = require('chai');
const chaiHTTP = require('chai-http');

const server = require('../app.js');
const response_94040 = require('./response_94040.js');

const should = chai.should();

chai.use(chaiHTTP);

describe('Get current weather tests', () => {

  describe('Valid weather response', () => {
    beforeEach(() => {
      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather').query(true)
        .reply(200, response_94040);
    });

    it('Got weather for a valid zip code', (done) => {
      chai.request(server).get('/local/94040')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(200);

          //Test result of name, company and location for the response
          expect(res.body.city).to.equal('Mountain View');
          expect(res.body.conditions).to.equal('clear sky');
          expect(res.body.high_temp).to.equal(60);
          expect(res.body.low_temp).to.equal(46);
          done();
        });
    });
  });

  describe('Got error from weather API', () => {
    beforeEach(() => {
      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather').query(true)
        .replyWithError({ cod: '404', message: 'city not found' });
    });

    it('Invalid zip code', (done) => {
      chai.request(server).get('/local/00000')
        .end((err, res) => {
          res.should.have.status(404);
          expect(res.text).equal("Failed to fetch weather data for 00000");
          done();
        });

    });
  });


});
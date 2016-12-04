'use strict';

const request    = require('request');
const config     = require('config');
const miner_host = config.get('miner_host');
const stats_host = config.get('stats_host');
const key        = config.get('key');
const interval   = config.get('interval');
const name       = config.get('name');


(function pulse() {

  request.get(miner_host, (err, res, body) => {

    try {

      const start  = body.indexOf('{');
      const end    = body.indexOf('}');
      const doc    = body.substring(start, end + 1);
      const result = JSON.parse(doc).result;

      request.post({
        url: stats_host,
        form: {
          key:  key,
          data: result
        }
      }, (err, res, body) => {
        if (!err) { console.log(Date.now(), 'submitted'); }
      });

    } catch (e) {
      // ignore
      console.error(e);
    } finally {
      setTimeout(pulse, interval);
    }

  });

}());

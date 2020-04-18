const mongoose = require('mongoose');

/** this project needs a db !! **/
// make a connection
mongoose.connect(process.env.DB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

// get reference to database
var db = mongoose.connection;

db.on('error', () => console.log('connection error:'));

// define Schema
var Schema = mongoose.Schema;

var shortUrlSchema = new Schema({
  url:  String,
  hash: String
});

// compile schema to model
var ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

var createAndSaveShortUrl = (url, done) => {
  ShortUrl.findOne({url : url}, (err, data) => {
    if (data) {
      done(null, data);
    } else {
      const shorty = new ShortUrl({'url': url});
      shorty.save((err, data) => err ? done(err) : done(null, data));
    }
  });
};

exports.ShortUrlModel = ShortUrl;
exports.createAndSaveShortUrl = createAndSaveShortUrl;
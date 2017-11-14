var express = require('express');
var d3 = require('d3-dsv');
var fs = require('fs');
var app = express();

let cityFile;

fs.readFile('./data/listing-details.csv', 'utf8', (err, cities) => {
  if (err) throw err;
  cityFile = cities;
});

app.get('/listings', (req, res)=>{
  let suggestion = {suggestions: []};
  let data = d3.csvParse(cityFile, function(d){
    return {
      "id": +d.id,
      "street": d.street,
      "status": d.status,
      "price": +d.price,
      "bedrooms": +d.bedrooms,
      "bathrooms": +d.bathrooms,
      "sq_ft": +d.sq_ft,
      "lat": +d.lat,
      "lng": +d.lng
    }
  });
  if(req.query.min_price || req.query.max_price){

  }
  if(req.query.min_bed || req.query.max_bed){

  }
  if(req.query.min_bath || req.query.max_bath){

  }
});


var port = process.env.PORT || 2345;
app.listen(port);
console.log('Server running at http://localhost:%d/', port);

module.exports = app;

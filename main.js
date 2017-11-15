const express = require('express');
const d3 = require('d3-dsv');
const fs = require('fs');
const app = express();

const { House, sequelize } = require('./models');
const Op = sequelize.Op;

let query = { where: {}};
let cityFile;

fs.readFile('./data/listing-details.csv', 'utf8', (err, cities) => {
  if (err) throw err;
  cityFile = cities;
});

function sqlQuery(minP, maxP, minBe, maxBe, minBa, maxBa){
  if(minP || maxP){
    if(minP && maxP){
      query.where = {...query.where,
        ...{price:{
        [Op.between] : [minP, maxP]
        }}}
    } else if (minP){
      query.where = {...query.where,
        ...{price:{
        [Op.gte] : minP
      }}}
    } else if (maxP){
      query.where = {...query.where,
        ...{price:{
        [Op.lte] : maxP
      }}}
    }
  }
  if(minBe || maxBe){
    if(minBe && maxBe){
      query.where = {...query.where,
        ...{bedrooms:{
        [Op.between] : [minBe, maxBe]
      }}}
    } else if (minBe){
      query.where = {...query.where,
        ...{bedrooms:{
        [Op.gte] : minBe
      }}}
    } else if (maxBe){
      query.where = {...query.where,
        ...{bedrooms:{
        [Op.lte] : maxBe
      }}}
    }
  }
  if(minBa || maxBa){
    if(minBa && maxBa){
      query.where = {...query.where,
        ...{bathrooms:{
        [Op.between] : [minBa, maxBa]
      }}}
    } else if (minBa){
      query.where = {...query.where,
        ...{bathrooms:{
        [Op.gte] : minBa
      }}}
    } else if (maxBa){
      query.where = {...query.where,
        ...{bathrooms:{
        [Op.lte] : maxBa
      }}}
    }
  }
}


app.get('/listings/populate/database', (req, res) => {
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
  data.forEach(async (d) => {
    try {
      await House.create({
        id: d.id,
        street: d.street,
        status: d.status,
        price: d.price,
        bedrooms: d.bedrooms,
        bathrooms: d.bathrooms,
        sq_ft: d.sq_ft,
        lat: d.lat,
        lng: d.lng
      })
    }
    catch(e){
      throw new Error(e);
    }
  })
});

app.get('/listings', (req, res)=>{
  const minP = parseInt(req.query.min_price);
  const maxP = parseInt(req.query.max_price);
  const minBe = parseInt(req.query.min_bed);
  const maxBe = parseInt(req.query.max_bed);
  const minBa = parseInt(req.query.min_bath);
  const maxBa = parseInt(req.query.max_bath);
  sqlQuery(minP, maxP, minBe, maxBe, minBa, maxBa);

  House.findAll(query)
  .then((houses) => {
    res.json({
      "type":"FeatureCollection",
      "features": houses.map((house) => {
            return {
              "type": "Feature",
              "geometry": {"type": "Point", "coordinates": [house.dataValues.lat,house.dataValues.lng]},
              "properties": {
                "id": house.dataValues.id,
                "price": house.dataValues.price,
                "street": house.dataValues.street,
                "bedrooms": house.dataValues.bedrooms,
                "bathrooms": house.dataValues.bathrooms,
                "sq_ft": house.dataValues.sq_ft
              }
            }
          })
    }
    );
  })
});


var port = process.env.PORT || 2345;
app.listen(port);
console.log('Server running at http://localhost:%d/', port);

module.exports = app;

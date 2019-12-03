const polka = require('polka');
const catchify = require('catchify');

const getData = require('./getData');

const LAT = process.env.LAT || 41.26;
const LON = process.env.LON || -95.94;
const PORT = process.env.PORT || 8080;

polka()
  .get('/weather', async (req, res) => {
    const [err, data] = await catchify(getData(LAT, LON));

    if (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({
        errors: [err],
      }));
    }

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      data: {
        id: Buffer.from(`${data.id}@${data.datetime}`).toString('base64'),
        type: 'observation',
        attributes: data,
      }
    }));
  })
  .listen(PORT, () => console.log(`🌧  - Starting Weather Conditions Server on Port ${PORT}`));

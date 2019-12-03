const got = require('got');
const catchify = require('catchify');
const moment = require('moment');
const qs = require('qs');

const pkg = require('../package');

const getEighth = (n) => Math.round((n / 360) * 8) / 8;
const getDirection = (n) => {
  switch(n) {
    case 0: return 'N';
    case 0.125: return 'NE';
    case 0.25: return 'E';
    case 0.375: return 'SE';
    case 0.5: return 'S';
    case 0.625: return 'SW';
    case 0.75: return 'W';
    case 0.875: return 'NW';
  }
};

module.exports = async (lat, lon) => {
 const [err, data] = await catchify(got(`http://forecast.weather.gov/MapClick.php?${qs.stringify({
    lat,
    lon,
    FcstType: 'json',
  })}`, {
   headers: {
     'User-Agent': `BikeClock/${pkg.version} (@Renddslow/otfl)`
   },
 }).json());

  if (err) {
    throw err;
  }

  const { currentobservation } = data;

  return {
    locationId: currentobservation.id,
    latitude: currentobservation.latitude,
    longitude: currentobservation.longitude,
    datetime: moment(currentobservation.Date, 'D MMM HH:mm a CST').toISOString(),
    temperature: parseInt(currentobservation.Temp, 10),
    dewPoint: parseInt(currentobservation.Dewp, 10),
    humidity: parseInt(currentobservation.Relh, 10),
    windSpeed: parseInt(currentobservation.Winds, 10),
    windDirection: getDirection(getEighth(parseInt(currentobservation.Windd, 10))),
    gust: parseInt(currentobservation.Gust, 10),
    condition: currentobservation.Weather,
    visibility: parseFloat(currentobservation.Visibility),
    barometer: {
      slp: parseFloat(currentobservation.SLP),
      mb: parseFloat(currentobservation.Altimeter),
    },
    windChill: parseInt(currentobservation.WindChill, 10),
  };
};

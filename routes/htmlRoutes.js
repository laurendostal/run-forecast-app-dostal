const router = require("express").Router();
const controllers = require("../controllers");
const checkAuth = require("../middleware/auth");
const db = require("../config/connection");
const axios = require('axios');


router.get("/", checkAuth, async (req, res) => {  
  const userid = req.session.userid
  const isLoggedIn = req.session.isLoggedIn
  let SQL = 'SELECT id, userid, DATE_FORMAT(date, "%Y-%m-%d") as date, DATE_FORMAT(clocktime, "%H:%i:%s") as clocktime'
      SQL = SQL+', distance, DATE_FORMAT(elapsedtime, "%H:%i:%s") as elapsedtime, location, temperature, feels_like_temperature, humidity'
      SQL = SQL+' FROM workouts WHERE userid = ? order by date desc;'    
  let params = [userid]
  try {
    const [workouts] = await db.query(SQL, params)
    res.render("index", {isLoggedIn: isLoggedIn, userid: userid, workouts} );
  } catch (err) {
    res.status(500).send('Error: ' + err.message)
  }
});


router.get("/login", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  res.render("index", { error: req.query.error });
});


router.get("/signup", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  res.render("signup", { error: req.query.error });
});


router.get("/weather", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("index", { error: 'please login' });
  }
  const weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q='
  const appId = '&appid=a1e5c995547a69253016f38705d20293'
  const unitParameter = "&units=imperial"
  const searchTerm = req.query.searchTerm
  const weatherURL = weatherAPI + searchTerm + unitParameter + appId
  try {
    const response = await axios.get(weatherURL)
    res.json(response.data)
  } catch (err) {
    res.status(502).send('Weather service not working')
  }
});


router.get("/workouts/:id", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("index", { error: 'please login' });
  }
  const workoutId = req.params.id
  const isLoggedIn = req.session.isLoggedIn
  const userid = req.session.userid
  const isUpdateRequest = true

  let SQL = 'SELECT id, userid, DATE_FORMAT(date, "%Y-%m-%d") as date, DATE_FORMAT(clocktime, "%H:%i:%s") as clocktime'
  SQL = SQL+', distance, DATE_FORMAT(elapsedtime, "%H:%i:%s") as elapsedtime, location, temperature, feels_like_temperature, humidity'
  SQL = SQL+' FROM workouts WHERE id = ?;'    
  let params = [workoutId]
  try {
    const [workout] = await db.query(SQL, params)

    res.render("index", { isLoggedIn: isLoggedIn, userid: userid, isUpdate: isUpdateRequest, workout} );
  } catch (err) {
    const errorMsg = "Unable to get workout data"
    res.render("index", { isLoggedIn: isLoggedIn, userid: userid, isUpdate: isUpdateRequest, error: errorMsg });
  }
});


router.delete("/workouts/:id", async (req, res) => {
  if (!req.session.isLoggedIn) {
    res.render("index", { error: 'please login' });
  }
  const workoutId = req.params.id
  const errorMsg = "Problem deleting workout"

  let SQL = 'DELETE FROM workouts WHERE id = ?;'
  let params = [workoutId]
  try {
    const [{affectedRows}] = await db.query(SQL, params)
    if (affectedRows === 0) {
      return res.status(500).send(errorMsg)
    } else {
      return res.status(200).send('')
    }
  } catch(err) {
    res.render("index", { error: errorMsg });
  }
});


router.put("/workouts/:id", async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.render("index", { error: 'please login' });
  }
  const workoutId = req.params.id

  const { 
    workout_date,
    workout_clocktime, 
    workout_distance,
    workout_elapsedtime,
    workout_location,
    workout_temperature, 
    workout_feels_like_temperature, 
    workout_humidity } = req.body

  let SQL = 'UPDATE workouts set date = ?, clocktime = ?, distance = ?, elapsedtime = ?, '
      SQL = SQL+'location = ?, temperature = ?, feels_like_temperature = ?, humidity = ? '
      SQL = SQL+'WHERE id = ?;'    
  let params = [workout_date, workout_clocktime, workout_distance, workout_elapsedtime, workout_location, workout_temperature, workout_feels_like_temperature, workout_humidity, workoutId]
  
  try {
    const [{affectedRows}] = await db.query(SQL, params)
    if (affectedRows === 0) {
      return res.status(500).send('problem updating workout')
    } else {
      return res.status(200).send('')
    }
  } catch(err) {
    res.render("index", { error: req.query.error });
  }
});


router.post("/workouts", async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.render("index", { error: 'please login' });
  }

  const userid = req.session.userid
  const isLoggedIn = req.session.isLoggedIn

  const { 
    workout_date,
    workout_clocktime, 
    workout_distance,
    workout_elapsedtime,
    workout_location,
    workout_temperature, 
    workout_feels_like_temperature, 
    workout_humidity } = req.body
   
  if (!(userid && workout_date && workout_clocktime && workout_distance)) {
    return res.redirect('/')
  }
  let SQL = 'INSERT INTO workouts (userid, date, clocktime, distance, elapsedtime, '
      SQL = SQL+'location, temperature, feels_like_temperature, humidity) '
      SQL = SQL+'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);'
  let params = [userid, workout_date, workout_clocktime, workout_distance, workout_elapsedtime, workout_location, workout_temperature, workout_feels_like_temperature, workout_humidity]
  
  try {
    const [{affectedRows}] = await db.query(SQL, params)

    if (affectedRows === 0) {
      return res.status(500).send('problem saving workout')
    }

    SQL = 'SELECT id, userid, DATE_FORMAT(date, "%Y-%m-%d") as date, DATE_FORMAT(clocktime, "%H:%i:%s") as clocktime, '
    SQL = SQL+'distance, DATE_FORMAT(elapsedtime, "%H:%i:%s") as elapsedtime, '
    SQL = SQL+'location, temperature, feels_like_temperature, humidity '
    SQL = SQL+'FROM workouts WHERE userid = ? order by date desc;'
    params = [userid]
    const [workouts] = await db.query(SQL, params)
    res.render("index", { isLoggedIn: isLoggedIn, userid: userid, workouts } );
  } catch (err) {
    res.status(500).send('Error: ' + err)
  }
});

module.exports = router;

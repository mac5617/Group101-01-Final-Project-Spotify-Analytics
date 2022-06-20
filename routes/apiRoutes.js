/* eslint-disable no-console */
import express from 'express';
import sequelize from 'sequelize';
import fetch from 'node-fetch';

import db from '../database/initializeDB.js';

import mealMapCustom from '../server/controllers/DiningHall.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the UMD Dining API!');
});

// /////////////////////////////////
// Food Inspection Set Demos
// /////////////////////////////////
router.route('/foodServicesPG') // actually localhost:3000/api/foodServicesPG
  .get(async (req, res) => {
    try {
      const url = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
      const data = await fetch(url);
      const json = await data.json();
      console.log(json);

      res.json({data: json});
    } catch (error) {
      console.log(error);
      res.json({error: error});
    }
  })
  .put((req, res) => {
    try {
      res.json({message: 'put FoodServices endpoint'});
    } catch (error) {
      console.log(error);
      res.json({error: 'Something went wrong on the server'});
    }
  })
  .post((req, res) => {
    try {
      res.json({message: 'post FoodServices endpoint'});
    } catch (error) {
      console.log(error);
      res.json({error: 'Something went wrong on the server'});
    }
  })
  .delete((req, res) => {
    try {
      res.json({message: 'delete FoodServices endpoint'});
    } catch (error) {
      console.log(error);
      res.json({error: 'Something went wrong on the server'});
    }
  });

router.route('/foodServicesPG/:zipCode') // actually localhost:3000/api/foodServicesPG/20782
  .get(async (req, res) => {
    try {
      const url = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
      const request = await fetch(url);
      const json = await request.json();
      console.log(json);

      const filteredList = json.filter((item, index) => {
        const {zipCode} = req.params;
        return item.zip === zipCode;
      });

      res.json({data: filteredList});
    } catch (error) {
      console.log(error);
      res.json({error: error});
    }
  })
  .put((req, res) => {
    try {
      res.json({message: 'put FoodServices ID endpoint'});
    } catch (error) {
      console.log(error);
      res.json({error: 'Something went wrong on the server'});
    }
  })
  .post((req, res) => {
    try {
      res.json({message: 'post FoodServices ID endpoint'});
    } catch (error) {
      console.log(error);
      res.json({error: 'Something went wrong on the server'});
    }
  })
  .delete((req, res) => {
    try {
      res.json({message: 'delete FoodServices ID endpoint'});
    } catch (error) {
      console.log(error);
      res.json({error: 'Something went wrong on the server'});
    }
  });

/// /////////////////////////////////
/// ////Dining Hall Endpoints////////
/// /////////////////////////////////

// TODO CLEAN ROUTE
router.route('/dining')
  .get(async (req, res) => {
    try {
      const halls = await db.DiningHall.findAll();
      const reply = halls.length > 0 ? { data: halls } : { message: 'no results found' };
      res.json(reply);
    } catch (error) {
      console.error(error);
      res.send('Something went wrong on /dining at get');
    }
  })
  .post(async (req, res) => {
    const halls = await db.DiningHall.findAll();
    const currentId = (await halls.length) + 1;
    try {
      const newDining = await db.DiningHall.create({
        hall_id: currentId,
        hall_name: req.body.hall_name,
        hall_address: req.body.hall_address,
        hall_lat: req.body.hall_lat,
        hall_long: req.body.hall_long
      });
      res.json(newDining);
    } catch (error) {
      console.error(error);
      res.send('Something went wrong on /dining at post');
    }
  })
  .put(async (req, res) => {
    try {
      await db.DiningHall.update(
        {
          hall_name: req.body.hall_name,
          hall_location: req.body.hall_location
        },
        {
          where: {
            hall_id: req.body.hall_id
          }
        }
      );
      res.send('Successfully Updated');
    } catch (error) {
      console.error(error);
      res.send('Something went wrong on /dining at put');
    }
  })
  .delete((req, res) => {
    try {
      res.send('touched delete');
    } catch (error) {
      console.error(error);
      res.send('Something went wrong on /dining at delete');
    }
  });

router.get('/dining/:hall_id', async (req, res) => {
  try {
    const hall = await db.DiningHall.findAll({
      where: {
        hall_id: req.params.hall_id
      }
    });

    res.json(hall);
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

router.delete('/dining/:hall_id', async (req, res) => {
  try {
    await db.DiningHall.destroy({
      where: {
        hall_id: req.params.hall_id
      }
    });
    res.send('Successfully Deleted');
  } catch (err) {
    console.error(err);
    res.send('Server error');
  }
});

/// /////////////////////////////////
/// ////////Meals Endpoints//////////
/// /////////////////////////////////
router.get('/meals', async (req, res) => {
  try {
    const meals = await db.Meals.findAll();
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

router.get('/meals/:meal_id', async (req, res) => {
  try {
    const meals = await db.Meals.findAll({
      where: {
        meal_id: req.params.meal_id
      }
    });
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

router.put('/meals', async (req, res) => {
  try {
    await db.Meals.update(
      {
        meal_name: req.body.meal_name,
        meal_category: req.body.meal_category
      },
      {
        where: {
          meal_id: req.body.meal_id
        }
      }
    );
    res.send('Meal Successfully Updated');
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

/// /////////////////////////////////
/// ////////Macros Endpoints/////////
/// /////////////////////////////////

// TODO CLEAN ROUTES
router.get('/macros', async (req, res) => {
  try {
    const macros = await db.Macros.findAll();
    res.send(macros);
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

router.get('/macros/:meal_id', async (req, res) => {
  try {
    const meals = await db.Macros.findAll({
      where: {
        meal_id: req.params.meal_id
      }
    });
    res.json(meals);
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

router.put('/macros', async (req, res) => {
  try {
    // N.B. - this is a good example of where to use code validation to confirm objects
    await db.Macros.update(
      {
        meal_name: req.body.meal_name,
        meal_category: req.body.meal_category,
        calories: req.body.calories,
        serving_size: req.body.serving_size,
        cholesterol: req.body.cholesterol,
        sodium: req.body.sodium,
        carbs: req.body.carbs,
        protein: req.body.protein,
        fat: req.body.fat
      },
      {
        where: {
          meal_id: req.body.meal_id
        }
      }
    );
    res.send('Successfully Updated');
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

/// /////////////////////////////////
/// Dietary Restrictions Endpoints///
/// /////////////////////////////////
router.get('/restrictions', async (req, res) => {
  try {
    const restrictions = await db.DietaryRestrictions.findAll();
    res.json(restrictions);
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

router.get('/restrictions/:restriction_id', async (req, res) => {
  try {
    const restrictions = await db.DietaryRestrictions.findAll({
      where: {
        restriction_id: req.params.restriction_id
      }
    });
    res.json(restrictions);
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

/// //////////////////////////////////
/// ///////Custom SQL Endpoint////////
/// /////////////////////////////////
const macrosCustom = 'SELECT `Dining_Hall_Tracker`.`Meals`.`meal_id` AS `meal_id`,`Dining_Hall_Tracker`.`Meals`.`meal_name` AS `meal_name`,`Dining_Hall_Tracker`.`Macros`.`calories` AS `calories`,`Dining_Hall_Tracker`.`Macros`.`carbs` AS `carbs`,`Dining_Hall_Tracker`.`Macros`.`sodium` AS `sodium`,`Dining_Hall_Tracker`.`Macros`.`protein` AS `protein`,`Dining_Hall_Tracker`.`Macros`.`fat` AS `fat`,`Dining_Hall_Tracker`.`Macros`.`cholesterol` AS `cholesterol`FROM(`Dining_Hall_Tracker`.`Meals`JOIN `Dining_Hall_Tracker`.`Macros`)WHERE(`Dining_Hall_Tracker`.`Meals`.`meal_id` = `Dining_Hall_Tracker`.`Macros`.`meal_id`)';
router.get('/table/data', async (req, res) => {
  try {
    const result = await db.sequelizeDB.query(macrosCustom, {
      type: sequelize.QueryTypes.SELECT
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

// const mealMapCustom = `SELECT hall_name,
//   hall_address,
//   hall_lat,
//   hall_long,
//   meal_name
// FROM
//   Meals m
// INNER JOIN Meals_Locations ml
//   ON m.meal_id = ml.meal_id
// INNER JOIN Dining_Hall d
// ON d.hall_id = ml.hall_id;`;
router.get('/map/data', async (req, res) => {
  try {
    const result = await db.sequelizeDB.query(mealMapCustom, {
      type: sequelize.QueryTypes.SELECT
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});
router.get('/custom', async (req, res) => {
  try {
    const result = await db.sequelizeDB.query(req.body.query, {
      type: sequelize.QueryTypes.SELECT
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.error('Server error');
  }
});

export default router;

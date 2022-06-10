var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with owner, time, gradients, preparation, image url and save this recipe in the family recipes list of the logged-in user
 */
router.post("/family", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let recipe_details = {
      owner: req.body.owner,
      time: req.body.time,
      gradients: req.body.gradients,
      preparation: req.body.preparation,
      image_url: req.body.image_url,
    }
    await DButils.execQuery(
      `INSERT INTO familyrecipes VALUES ('${user_id}','${recipe_details.owner}', '${recipe_details.time}', '${recipe_details.gradients}',
      '${recipe_details.preparation}', '${recipe_details.image_url}')`
    );
    res.status(201).send({ message: "family recipe created", success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the family recipes that were saved by the logged-in user
 */
 router.get('/family', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let family_recipes = {};
    const recipes_id = await user_utils.getFamilyRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get("/ThreeLastRecipes", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let recipesData = await user_utils.getThreeLastRecipesIds(user_id);
    res.send(recipesData);
  } catch (error) {
    console.log(error);
    next(error);
  }
});


module.exports = router;

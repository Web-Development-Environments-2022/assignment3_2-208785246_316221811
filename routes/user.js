var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here!"));

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
});


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
 * This path returns the family recipes that were saved by the logged-in user
 */
 router.get('/family', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes = await user_utils.getFamilyRecipes(user_id);
    let recipes_array = [];
    recipes.map((element) => recipes_array.push(element.recipe_id)); //extracting the recipe ids into array
    res.status(200).send(recipes);
  } catch(error){
    next(error); 
  }
});

/**
 * save recipe in the user recipes list of the logged-in user
 */
 router.post("/myrecipe", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let recipe_details = {
      title: req.body.title,
      readyInMinutes: req.body.readyInMinutes,
      image: req.body.image,
      vegan: req.body.vegan,
      vegetarian: req.body.vegetarian,
      glutenFree: req.body.glutenFree,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      servings: req.body.servings,
    }
    await DButils.execQuery(
      `INSERT INTO userrecipes(user_id,title,readyInMinutes,image,vegan,vegetarian,glutenFree,ingredients,instructions,servings) VALUES ('${user_id}',
      '${recipe_details.title}', '${recipe_details.readyInMinutes}', '${recipe_details.image}', '${recipe_details.vegan}', '${recipe_details.vegetarian}',
      '${recipe_details.glutenFree}', '${recipe_details.ingredients}', '${recipe_details.instructions}', '${recipe_details.servings}')`
    );
    res.status(201).send({ message: "personal recipe created", success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the personal recipes that were saved by the logged-in user
 */
 router.get('/myrecipe', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getMyRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    res.status(200).send(recipes_id);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipeId and save this recipe in the viewed list of the logged-in user
 */
 router.post('/viewed', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsViewed(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as viewed");
    } catch(error){
    next(error);
  }
});


/**
 * This path returns the last three recipes that viewed by the logged-in user
 */
router.get("/ThreeLastRecipes", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let recipes = await user_utils.getThreeLastRecipesIds(user_id);
    res.send(recipes);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/**
 * This path returns the last recipe that viewed by the logged-in user
 */
 router.get("/lastRecipe", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let recipes = await user_utils.getThreeLastRecipesIds(user_id);
    res.send(recipes[0]);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;

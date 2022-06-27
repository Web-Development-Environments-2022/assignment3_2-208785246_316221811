var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here!"));

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getFullRecipeById(req.query.recipeId);
    res.send(recipe); //the get returns this
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns details of chosen number of random recipes
 */
router.get("/GetRandomRecipes", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getRandomNumOfRecipes(req.query.num);
    res.send(recipes); //the get returns this
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns details of recipes with instructions
 */
router.get("/searchRecipes", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getSearchRecipes(req.query);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

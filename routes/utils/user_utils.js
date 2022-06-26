const DButils = require("./DButils");
const recipe_utils = require("./recipes_utils");


async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values ('${user_id}',${recipe_id})`);
}

async function markAsViewed(user_id, recipe_id){
    await DButils.execQuery(`insert into lastviewed(user_id,recipe_id) values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function getFamilyRecipes(user_id){
    const family_recipes = await DButils.execQuery(`select recipe_id, owner, time, gradients, preparation, imageurl from familyrecipes where user_id='${user_id}'`);
    return family_recipes;
}

async function getMyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select title, readyInMinutes, image, vegan, vegetarian, glutenFree, popularity, ingredients, instructions, servings from userrecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function getThreeLastRecipesIds(user_id){
    let last_recipes = await DButils.execQuery(`select recipe_id from lastviewed where user_id='${user_id}' order by time desc limit 3`);
    let recipes_results = [];
    //check if the viewed recipe is family recipe, personal recipe or spoonacular recipe
    for (let i = 0; i < last_recipes.length; i++) {
        current_recipe_id = last_recipes[i].recipe_id;
        let ans = await DButils.execQuery(`select owner, time, gradients, preparation, imageurl from familyrecipes where user_id='${user_id}' and recipe_id='${current_recipe_id}'`);
        if (ans.length != 0){
            recipes_results.push(ans);
        }
        else{
            ans = await DButils.execQuery(`select title, readyInMinutes, image, vegan, vegetarian, glutenFree, popularity, ingredients, instructions, servings from userrecipes where user_id='${user_id}' and recipe_id='${current_recipe_id}'`);
            if (ans.length != 0){
                recipes_results.push(ans);
            }
            else{
                const recipe = await recipe_utils.getRecipeDetails(current_recipe_id)
                recipes_results.push(recipe);
            }
        }
    }
    return recipes_results;
    }


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipes = getFamilyRecipes;
exports.getMyRecipes = getMyRecipes;
exports.markAsViewed = markAsViewed;
exports.getThreeLastRecipesIds = getThreeLastRecipesIds;

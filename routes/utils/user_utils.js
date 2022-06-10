const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values ('${user_id}',${recipe_id})`);
}

async function markAsViewed(user_id, recipe_id){
    await DButils.execQuery(`insert into lastviewed values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function getFamilyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from familyrecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function getMyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from myrecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function getThreeLastRecipesIds(user_id){
    let lastRecipes = await DButils.execQuery(`select top 3 recipe_id from lastviewed where user_id='${user_id}' order by time DESC`);
    let idsArray = await convertToArry(lastRecipes);
    let recipesData = await recipeUtil.getRecipesInformation(idsArray);
    let relevantRecipeData = await recipeUtil.extractPrevData(recipesData);
    return relevantRecipeData;
    }


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getFamilyRecipes = getFamilyRecipes;
exports.getMyRecipes = getMyRecipes;
exports.markAsViewed = markAsViewed;
exports.getThreeLastRecipesIds = getThreeLastRecipesIds;

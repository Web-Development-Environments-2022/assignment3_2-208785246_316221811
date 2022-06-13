const axios = require("axios");
const res = require("express/lib/response");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, { //to spoonacular
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function extractFullRecipesDetails(recipes_info){ 
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        if (recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
            extendedIngredients,
            analyzedInstructions,
            servings,
        } = data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            image: image,
            aggregateLikes: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            extendedIngredients: extendedIngredients, 
            instructions: analyzedInstructions, 
            servings: servings,
        }
    })
}

 

async function exractPreviewRecipeDetails(recipes_info){
    //return (recipes_info.length)
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        if (recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = data;
        return {
            id: id,
            title: title,
            image: image,
            readyInMinutes: readyInMinutes,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree
        }
    })
}

async function getRecipesPreview(recipes_ids_list){
    let promises = [];
    recipes_ids_list.map((id) => {
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    return exractPreviewRecipeDetails(info_res);
}


async function getRandomRecipes(){
    const response = await axios.get(`${api_domain}/random`, { //go to spoonacular 
        params:{
            number: 10,
            apiKey: process.env.spooncular_apiKey
        }
    })
    return response;
}


async function searchRecipes(query_search){
    if (!query_search.number){
        query_search.number = 5; //default value
    }
    const response = await axios.get(`${api_domain}/complexSearch`, { //go to spoonacular 
        params:{
            query: query_search.query,
            cuisine: query_search.cuisine,
            diet: query_search.diet,
            intolerances: query_search.intolerances,
            number: query_search.number,
            addRecipeInformation:true,
            apiKey: process.env.spooncular_apiKey,
        }                     
    })
    return response;
}


async function getRandomNumOfRecipes(num){
    let random_pool = await getRandomRecipes();
    let filtered_random_recipes = random_pool.data.recipes.filter((random) => (random.instructions != "") && (random.image)) 
    if(filtered_random_recipes.length < num){
        return getRandomNumOfRecipes(num)
    }
    return exractPreviewRecipeDetails(filtered_random_recipes.slice(0, num))
}

async function getSearchRecipes(query){
    let search_pool = await searchRecipes(query)
    let filtered_search_recipes = search_pool.data.results.filter((search) => (search.instructions != "") && (search.image))
    return extractFullRecipesDetails(filtered_search_recipes)
}

exports.getRecipeDetails = getRecipeDetails;
exports.getRandomNumOfRecipes = getRandomNumOfRecipes;
exports.getRecipesPreview = getRecipesPreview;
exports.searchRecipes = searchRecipes;
exports.getSearchRecipes = getSearchRecipes;
exports.getRecipeInformation = getRecipeInformation;
exports.extractFullRecipesDetails = extractFullRecipesDetails;

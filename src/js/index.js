import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';

/*Global state of the application
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes
 */

const state = {};

//SEARCH CONTROLLER
const controlSearch = async() => {
    //1. Get the query from the view
    const query = searchView.getInput();

    if (query) {
        //2. Create new search object
        state.search = new Search(query);

        //3. Set up UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            //4. Search for recipes
            await state.search.getResults();
    
            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong with the search...');
            clearLoader();
        }
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

//RECIPE CONTROLLER
const controlRecipe = async () => {
    //Get ID from the url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //Prepare the UI for changes

        //Create new recipe object
        state.recipe = new Recipe(id);

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render the recipe
            console.log(state.recipe);
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }
};

//Eventlistener for multiple events
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

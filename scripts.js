let recipeCounter = 3;
function loadHomeRecipes() {
    fetch('https://jsonblob.com/api/jsonblob/1214331063873953792')
    .then(response => response.json())
    .then(data => {
        const recipes = data.recipes.filter(recipe => recipe.category === 'meal');
        displayRecipes(recipes.slice(0, recipeCounter));
        if (recipes.length <= recipeCounter) {
            document.getElementById('loadMoreBtn').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
    });
}


function loadMoreRecipes() {
    fetch('https://jsonblob.com/api/jsonblob/1214331063873953792')
    .then(response => response.json())
    .then(data => {
        const remainingRecipes = data.recipes.slice(recipeCounter, recipeCounter + 3);
        displayRecipes(remainingRecipes);
        recipeCounter += remainingRecipes.length;

        if (recipeCounter >= data.recipes.length) {
            document.getElementById('loadMoreBtn').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
    });
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    let row;
    recipes.forEach((recipe, index) => { //will display 3 recipes per row
        if (index % 3 === 0) {
            row = document.createElement('div');
            row.classList.add('row');
            recipeList.appendChild(row);
        }
        //dynamically creating the html for the recipe cards
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card', 'col-md-4');
        recipeCard.style.textAlign = "center";
        //creating an event listener that will listen if the recipe card is clicked and will take them to a page containing more details
        recipeCard.addEventListener('click', () => {
            const urlParams = new URLSearchParams();
            urlParams.append('recipeName', recipe.name);
            window.location.href = `one_item.html?${urlParams.toString()}`;
        });
        //changes cursor to show that recipe-card is clickable
        recipeCard.style.cursor = "pointer";

        const image = document.createElement('div');
        image.classList.add('image');
        const imageName = recipe.name.toLowerCase().replace(/\s+/g, '-'); 
        const imagePath = `./images/${imageName}.jpeg`; 
        // used chatgpt to help with the error of dynamically displaying images
        //in image file names that contain spaces like "Spaghetti Carbonara" this will create a imageName variable
        //that will store recipe.name and replace spaces with a hyphon and use lowercase formatting
        const recipe_img = document.createElement('img');
        recipe_img.src = imagePath;
        recipe_img.alt = recipe.name;

        image.appendChild(recipe_img);

        const customLine = document.createElement('div');
        customLine.classList.add('custom-line');

        const recipeCardTitle = document.createElement('div');
        recipeCardTitle.classList.add('recipe-card-title', 'font-body');
        const title = document.createElement('p');
        title.textContent = recipe.name;
        title.style.fontSize = "24px";
        title.style.textAlign = "center";

        const nutritionList = document.createElement('ul');
        const caloriesItem = document.createElement('li');
        const proteinItem = document.createElement('li');
        const carbsItem = document.createElement('li');

        caloriesItem.textContent = `Calories: ${recipe.nutrition.calories}`;
        proteinItem.textContent = `Protein: ${recipe.nutrition.protein}`;
        carbsItem.textContent = `Carbs: ${recipe.nutrition.carbs}`;

        //creating link to recipe
        const linkToRecipe = document.createElement('a');
        linkToRecipe.classList.add('font-body');
        linkToRecipe.href = '';
        linkToRecipe.textContent = 'See more details';
        linkToRecipe.style.textAlign = "center";

        //establshing parent/child relationship 
        nutritionList.appendChild(caloriesItem);
        nutritionList.appendChild(proteinItem);
        nutritionList.appendChild(carbsItem);

        recipeCardTitle.appendChild(title);
        recipeCardTitle.appendChild(nutritionList);

        recipeCard.appendChild(image);
        recipeCard.appendChild(customLine);
        recipeCard.appendChild(recipeCardTitle);
        recipeCard.appendChild(linkToRecipe);

        row.appendChild(recipeCard);
     
    })
}


function fetchHomeDessertRecipes() {
        fetch('https://jsonblob.com/api/jsonblob/1214331063873953792')
        .then(response => response.json())
        .then(data => {
            displayDesserts(data.recipes); //when fetchDessertRecipes is called, it also calls displayDesserts
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
        });
}

function displayDesserts(recipes){
    const dessertRecipe = recipes.filter(recipe => recipe.category === "dessert").slice(0, 2);

    dessertRecipe.forEach(recipe => {
        const dessertCardContainer = document.createElement('div');
        dessertCardContainer.classList.add('row', 'dessert-card-container');

        const dessertCard = document.createElement('div');
        dessertCard.classList.add('dessert-card');
        //image column
        const imageName = recipe.name.toLowerCase().replace(/\s+/g, '-'); 
        const imagePath = `./images/${imageName}.jpeg`; 
        const dessertImgCol = document.createElement('div');
        dessertImgCol.style.marginTop = "25px";
        dessertImgCol.style.marginLeft = "50px"
        dessertImgCol.classList.add('dessert-image', 'col-md-6');
        dessertImgCol.innerHTML = `<img src="${imagePath}">`;
        //dessert details column
        const dessertCardDetails = document.createElement('div');
        dessertCardDetails.classList.add('dessert-details', 'col-md-6', 'font-body');
        dessertCardDetails.style.marginTop = "45px";
        dessertCardDetails.innerHTML = `<h3 style="margin-top: 50px; margin-left: 25px; text-align: center">${recipe.name}</h3>`;

        const ingredientsListLeft = document.createElement('ul');
        const ingredientsListRight = document.createElement('ul');

        // Dividing the ingredients into 2 sections to prevent long lists of data on each dessert card
        const ingredientsLeft = recipe.ingredients.slice(0, 5); //splitting ingredients list by 5
        const ingredientsRight = recipe.ingredients.slice(5);

        
        ingredientsLeft.forEach(ingredient => {
            const listIngredient = document.createElement('li');
            listIngredient.textContent = ingredient;
            ingredientsListLeft.appendChild(listIngredient);
        });

        
        ingredientsRight.forEach(ingredient => {
            const listIngredient = document.createElement('li');
            listIngredient.textContent = ingredient;
            ingredientsListRight.appendChild(listIngredient);
        });

        dessertCardDetails.appendChild(ingredientsListLeft);
        dessertCardDetails.appendChild(ingredientsListRight);

        dessertCard.appendChild(dessertImgCol);
        dessertCard.appendChild(dessertCardDetails);

        dessertCardContainer.appendChild(dessertCard);

        const line = document.createElement('div');
        line.style.marginTop = "25px";
        line.style.borderTop = '1px solid orange';
        line.style.marginLeft = "150px";
        line.style.width = "1000px";
        dessertCardContainer.appendChild(line);

        document.getElementById('dessert-container').appendChild(dessertCardContainer);
    })
}

function getDesserts(recipes){
    const dessertRecipe = recipes.filter(recipe => recipe.category === "dessert");

    dessertRecipe.forEach(recipe => {
        const dessertCardContainer = document.createElement('div');
        dessertCardContainer.classList.add('row', 'dessert-card-container');

        const dessertCard = document.createElement('div');
        dessertCard.classList.add('dessert-card');
        //image column
        const imageName = recipe.name.toLowerCase().replace(/\s+/g, '-'); 
        const imagePath = `./images/${imageName}.jpeg`; 
        const dessertImgCol = document.createElement('div');
        dessertImgCol.style.marginTop = "25px";
        dessertImgCol.style.marginLeft = "50px"
        dessertImgCol.classList.add('dessert-image', 'col-md-6');
        dessertImgCol.innerHTML = `<img src="${imagePath}">`;
        //dessert details column
        const dessertCardDetails = document.createElement('div');
        dessertCardDetails.classList.add('dessert-details', 'col-md-6', 'font-body');
        dessertCardDetails.style.marginTop = "45px";
        dessertCardDetails.innerHTML = `<h3 style="margin-top: 50px; margin-left: 25px; text-align: center">${recipe.name}</h3>`;

        const ingredientsListLeft = document.createElement('ul');
        const ingredientsListRight = document.createElement('ul');

        // Dividing the ingredients into 2 sections to prevent long lists of data on each dessert card
        const ingredientsLeft = recipe.ingredients.slice(0, 5); //splitting ingredients list by 5
        const ingredientsRight = recipe.ingredients.slice(5);

        
        ingredientsLeft.forEach(ingredient => {
            const listIngredient = document.createElement('li');
            listIngredient.textContent = ingredient;
            ingredientsListLeft.appendChild(listIngredient);
        });

        
        ingredientsRight.forEach(ingredient => {
            const listIngredient = document.createElement('li');
            listIngredient.textContent = ingredient;
            ingredientsListRight.appendChild(listIngredient);
        });

        dessertCardDetails.appendChild(ingredientsListLeft);
        dessertCardDetails.appendChild(ingredientsListRight);

        dessertCard.appendChild(dessertImgCol);
        dessertCard.appendChild(dessertCardDetails);

        dessertCardContainer.appendChild(dessertCard);

        const line = document.createElement('div');
        line.style.marginTop = "25px";
        line.style.borderTop = '1px solid orange';
        line.style.marginLeft = "150px";
        line.style.width = "1000px";
        dessertCardContainer.appendChild(line);

        document.getElementById('dessert-container').appendChild(dessertCardContainer);
    })
}

function loadRecipesPage() {
    fetch('https://jsonblob.com/api/jsonblob/1214331063873953792')
    .then(response => response.json())
    .then(data => {
        const recipes = data.recipes.filter(recipe => recipe.category === 'meal') //only getting meal recipes
        displayRecipes(recipes);
    })
}   

function loadDessertsRecipesPage(){
    fetch('https://jsonblob.com/api/jsonblob/1214331063873953792')
    .then(response => response.json())
    .then(data => {
        getDesserts(data.recipes); //this will only display the first 3 recipes for the homepage
    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
    });
}

function getRecipeDetails() {
    const parameters = new URLSearchParams(window.location.search);
    const recipeName = parameters.get('recipeName');
    if (recipeName) {
        fetch('https://jsonblob.com/api/jsonblob/1214331063873953792')
            .then(response => response.json())
            .then(data => {
                const recipe = data.recipes.find(recipe => recipe.name === recipeName);
                if (recipe) {
                    generateRecipeDetails(recipe);
                }
            });
    }
}

function generateRecipeDetails(recipe) {
    fetch('https://jsonblob.com/api/jsonblob/1209605678733058048')
        .then(response => response.json())
        .then(data => {
            const foundRecipe = data.recipes.find(r => r.name === recipe.name);

            if (foundRecipe) {
                displayRecipeDetails(foundRecipe);
            } else {
                console.error('Recipe not found');
            }
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
        });
}

function displayRecipeDetails(recipe) {
    document.getElementById('recipe-title').textContent = recipe.name;

    const ingredientsList = document.getElementById('recipe-ingredients');
    ingredientsList.textContent = `Ingredients: ${recipe.ingredients.join(', ')}`;

    const instructions = document.getElementById('recipe-instructions');
    instructions.textContent = `Instructions: ${recipe.instructions}`;

    const nutritionInfo = document.getElementById('recipe-nutrition');
    nutritionInfo.textContent = `Nutrition - Calories: ${recipe.nutrition.calories}, Protein: ${recipe.nutrition.protein}, Carbs: ${recipe.nutrition.carbs}`;
}

document.addEventListener('DOMContentLoaded', getRecipeDetails);

document.addEventListener('DOMContentLoaded', function () {
    const seeMoreLink = document.querySelector('#recipe-list a');
    
    if (seeMoreLink) {
        seeMoreLink.addEventListener('click', function (event) {
            event.preventDefault();
            const recipeName = this.closest('.recipe-card').querySelector('.recipe-card-title p').textContent;
            loadRecipeDetails(recipeName);
            
            window.location.href = 'one_item.html';
        });
    }
});

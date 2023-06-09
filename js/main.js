import recipes from '../data/recipes.js';

let searchResult = recipes;
let listOfIngredientsTags = [];
let listOfAppliancesTags = [];
let listOfUstensilsTags = [];
let initialIngredientsList = [];
let initialAppliancesList = [];
let initialUstensilsList = [];

// Remplissage des listes initiales avec toutes les valeurs uniques
recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
        const ingredientName = ingredient.ingredient.toLowerCase();
        if (!initialIngredientsList.includes(ingredientName)) {
            initialIngredientsList.push(ingredientName);
        }
    });

    const applianceName = recipe.appliance.toLowerCase();
    if (!initialAppliancesList.includes(applianceName)) {
        initialAppliancesList.push(applianceName);
    }

    recipe.ustensils.forEach(ustensil => {
        const ustensilName = ustensil.toLowerCase();
        if (!initialUstensilsList.includes(ustensilName)) {
            initialUstensilsList.push(ustensilName);
        }
    });
});

window.onload = function () {
    const searchbar = document.querySelector('#searchBar');
    const searchBarIngredients = document.querySelector('#searchBarIngredients');
    const searchBarAppliances = document.querySelector('#searchBarAppliances');
    const searchBarUstensils = document.querySelector('#searchBarUstensils');

    searchbar.addEventListener("keyup", function () {
        search()
    });
    searchBarIngredients.addEventListener("keyup", function () {
        searchInIngredientsTags(searchBarIngredients.value);
    });

    searchBarAppliances.addEventListener("keyup", function () {
        searchInAppliancesTags(searchBarAppliances.value);
    });

    searchBarUstensils.addEventListener("keyup", function () {
        searchInUstensilsTags(searchBarUstensils.value);
    });

    searchBarIngredients.addEventListener("focus", function () {
        showDropdownIngredients();
    });

    searchBarAppliances.addEventListener("focus", function () {
        showDropdownAppliances();
    });

    searchBarUstensils.addEventListener("focus", function () {
        showDropdownUsentils();
    });

    displayRecipes(searchResult);

    const dropdowns = document.querySelectorAll('.dropdown-arrow');
    const dropListIngredients = document.querySelector('#searchSuggestionIngredient');
    const dropListAppliances = document.querySelector('#searchSuggestionAppliance');
    const dropListUstensils = document.querySelector('#searchSuggestionUstensil');
    const dropdownIngredients = document.querySelector('#dropdown-ingredients');
    const dropdownAppliances = document.querySelector('#dropdown-appliances');
    const dropdownUstensils = document.querySelector('#dropdown-ustensils');
    dropdowns.forEach(element => {
        element.addEventListener("click", function () {
            if (element.id === 'dropdown-ingredient') {
                if (dropListIngredients.style.display !== 'block') {
                    showDropdownIngredients();
                } else {
                    dropListIngredients.style.display = "none";
                    dropdownIngredients.classList.remove('opened');
                }
            }
            if (element.id === 'dropdown-appliance') {
                if (dropListAppliances.style.display !== 'block') {
                    showDropdownAppliances();
                } else {
                    dropListAppliances.style.display = "none";
                    dropdownAppliances.classList.remove('opened');
                }
            }
            if (element.id === 'dropdown-ustensil') {
                if (dropListUstensils.style.display !== 'block') {
                    showDropdownUsentils();
                } else {
                    dropListUstensils.style.display = "none";
                    dropdownUstensils.classList.remove('opened');
                }
            }
        });
    });
};

function showDropdownIngredients() {
    const dropListIngredients = document.querySelector('#searchSuggestionIngredient');
    const dropdownIngredients = document.querySelector('#dropdown-ingredients');
    dropListIngredients.style.display = "block";
    dropdownIngredients.classList.add('opened');
}

function showDropdownAppliances() {
    const dropListAppliances = document.querySelector('#searchSuggestionAppliance');
    const dropdownAppliances = document.querySelector('#dropdown-appliances');
    dropListAppliances.style.display = "block";
    dropdownAppliances.classList.add('opened');
}

function showDropdownUsentils() {
    const dropListUstensils = document.querySelector('#searchSuggestionUstensil');
    const dropdownUstensils = document.querySelector('#dropdown-ustensils');
    dropListUstensils.style.display = "block";
    dropdownUstensils.classList.add('opened');
}

function search() {
    const searchTerm = document.querySelector('#searchBar').value.toLowerCase();
    if (searchTerm && searchTerm.length < 3) return;
    const searchResult = recipes.filter(recipe => {
        const lowerCaseRecipeName = recipe.name.toLowerCase();
        const lowerCaseRecipeDescription = recipe.description.toLowerCase();
        const lowerCaseRecipeAppliance = recipe.appliance.toLowerCase();
        const lowerCaseRecipeUstensils = recipe.ustensils.map(ustensil => ustensil.toLocaleLowerCase())
        const lowerCaseRecipeIngredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
        const lowerCaseRecipeIngredientsTags = listOfIngredientsTags.map(tag => tag.toLowerCase());
        const lowerCaseRecipeAppliancesTags = listOfAppliancesTags.map(tag => tag.toLowerCase());
        const lowerCaseRecipeUstensilsTags = listOfUstensilsTags.map(tag => tag.toLowerCase());

        // Check if there is a matching recipe name, description, ingredient or tag
        const hasMatchingRecipeName = lowerCaseRecipeName.includes(searchTerm);
        const hasMatchingRecipeDescription = lowerCaseRecipeDescription.includes(searchTerm);

        // Check if all tags are present in the recipe
        const hasMatchingIngredientsTags = lowerCaseRecipeIngredientsTags.every(tag =>
            lowerCaseRecipeIngredients.some(ingredient => ingredient == tag)
        );

        // Check if at least one ingredient matches the search term
        const hasMatchingRecipeIngredients = lowerCaseRecipeIngredients.every(ingredient =>
            ingredient.includes(searchTerm)
        );

        const hasMatchingUstensilsTags = lowerCaseRecipeUstensilsTags.every(tag =>
            lowerCaseRecipeUstensils.some(ustensil => ustensil == tag)
        );

        // Check if at least one appliance tag matches the recipe appliance
        const hasMatchingAppliancesTags = lowerCaseRecipeAppliancesTags.every(tag =>
            lowerCaseRecipeAppliance == tag
        );

        // Return the recipe if it matches the search term, has matching tags, and has matching ingredients
        return ((hasMatchingRecipeName || hasMatchingRecipeDescription || hasMatchingRecipeIngredients) && hasMatchingIngredientsTags && hasMatchingAppliancesTags && hasMatchingUstensilsTags);
    });
    if (searchResult.length === 0) {
        console.log("Aucune recette trouvée");
    }
    displayRecipes(searchResult);
    // Update initialIngredientsList, initialAppliancesList, initialUstensilsList
    initialIngredientsList = [...new Set(searchResult.flatMap(recipe => recipe.ingredients.map(ingredient => ingredient.ingredient)))];
    initialAppliancesList = [...new Set(searchResult.map(recipe => recipe.appliance))];
    initialUstensilsList = [...new Set(searchResult.flatMap(recipe => recipe.ustensils))];
}

function displayRecipes(recettes) {
    const cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = '';
    recettes.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("card");

        const thumb = document.createElement("div");
        thumb.classList.add("thumb");
        card.appendChild(thumb);

        const cardContent = document.createElement("div");
        cardContent.classList.add("cardContent");
        card.appendChild(cardContent);

        const cardTitle = document.createElement("div");
        cardTitle.classList.add("cardTitle");
        cardContent.appendChild(cardTitle);

        const h2 = document.createElement("h2");
        h2.textContent = recipe.name;
        cardTitle.appendChild(h2);

        const timer = document.createElement("div");
        timer.classList.add("timer");
        cardTitle.appendChild(timer);

        const i = document.createElement("i");
        i.classList.add("fa-regular", "fa-clock");
        timer.appendChild(i);

        const p = document.createElement("p");
        p.textContent = recipe.time + " min";
        timer.appendChild(p);

        const cardDescription = document.createElement("div");
        cardDescription.classList.add("cardDescription");
        cardContent.appendChild(cardDescription);

        const ul = document.createElement("ul");
        cardDescription.appendChild(ul);

        recipe.ingredients.forEach(element => {
            const li = document.createElement("li");

            if (element.quantity) {
                const quantityString = element.quantity + (element.unit ? ` ${element.unit}` : '');
                li.innerHTML = `<b>${element.ingredient}</b>: ${quantityString}`;
            } else {
                li.innerHTML = `<b>${element.ingredient}</b>`;
            }

            ul.appendChild(li);
        });

        const description = document.createElement("p");
        description.textContent = recipe.description;
        cardDescription.appendChild(description);

        cardsContainer.appendChild(card);
    });

    getIngredientsTag(recettes);
    getAppliancesTag(recettes);
    getUstensilsTag(recettes);
}


function getIngredientsTag(search) {
    const listOfIngredients = [];

    search.forEach(element => {
        element.ingredients.forEach(ingredients => {
            listOfIngredients.push(ingredients.ingredient);
        });
    });

    const uniqueIngredients = [...new Set(listOfIngredients)];
    displayIngredients(uniqueIngredients);
}

function getAppliancesTag(search) {
    const listOfAppliances = [];
    search.forEach(element => {
        listOfAppliances.push(element.appliance);
    });

    const uniqueAppliances = [...new Set(listOfAppliances)];
    displayAppliances(uniqueAppliances);
}

function getUstensilsTag(search) {
    const listOfUstensils = [];

    search.forEach(element => {
        element.ustensils.forEach(ustensil => {
            listOfUstensils.push(ustensil);
        });
    });

    const uniqueUstensils = [...new Set(listOfUstensils)];
    displayUstensils(uniqueUstensils);
}

function displayUstensils(list) {
    const datalist = document.querySelector('#searchSuggestionUstensil');
    datalist.innerHTML = '';

    list.forEach(suggestion => {
        const element = document.createElement('li');
        const button = document.createElement('button');
        button.classList.add('tagBouton');
        button.id = suggestion;
        button.textContent = suggestion;
        button.onclick = function () {
            addTagUstensil(suggestion);
        };
        element.appendChild(button)
        datalist.appendChild(element);
    });
}

function displayAppliances(list) {
    const datalist = document.querySelector('#searchSuggestionAppliance');
    datalist.innerHTML = '';

    list.forEach(suggestion => {
        const element = document.createElement('li');
        const button = document.createElement('button');
        button.classList.add('tagBouton');
        button.id = suggestion;
        button.textContent = suggestion;
        button.onclick = function () {
            addTagAppliance(suggestion);
        };
        element.appendChild(button)
        datalist.appendChild(element);
    });
}

function displayIngredients(list) {
    const datalist = document.querySelector('#searchSuggestionIngredient');
    datalist.innerHTML = '';

    list.forEach(suggestion => {
        const element = document.createElement('li');
        const button = document.createElement('button');
        button.classList.add('tagBouton');
        button.id = suggestion;
        button.textContent = suggestion;
        button.onclick = function () {
            addTagIngredient(suggestion);
        };
        element.appendChild(button)
        datalist.appendChild(element);
    });
}

function addTagUstensil(value) {
    listOfUstensilsTags.push(value);
    displayTags();
    search();
}

function addTagAppliance(value) {
    listOfAppliancesTags.push(value);
    displayTags();
    search();
}

function addTagIngredient(value) {
    listOfIngredientsTags.push(value);
    displayTags();
    search();
}

function displayTags() {
    const tagContainer = document.querySelector('#tagsContainer');
    tagContainer.innerHTML = '';

    listOfIngredientsTags.forEach(tag => {
        const div = document.createElement('div');
        div.classList.add('tag', 'ingredient');
        const tagName = document.createElement('p');
        tagName.textContent = tag;
        div.appendChild(tagName);

        const btn = document.createElement('button');
        btn.id = tag;
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        btn.addEventListener('click', () => {
            removeTag(tag, 'ingredient');
        });
        div.appendChild(btn);

        tagContainer.appendChild(div);
    });

    listOfAppliancesTags.forEach(tag => {
        const div = document.createElement('div');
        div.classList.add('tag', 'appliance');
        const tagName = document.createElement('p');
        tagName.textContent = tag;
        div.appendChild(tagName);

        const btn = document.createElement('button');
        btn.id = tag;
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        btn.addEventListener('click', () => {
            removeTag(tag, "appliance");
        });
        div.appendChild(btn);

        tagContainer.appendChild(div);
    });

    listOfUstensilsTags.forEach(tag => {
        const div = document.createElement('div');
        div.classList.add('tag', 'ustensil');
        const tagName = document.createElement('p');
        tagName.textContent = tag;
        div.appendChild(tagName);

        const btn = document.createElement('button');
        btn.id = tag;
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        btn.addEventListener('click', () => {
            removeTag(tag, "ustensil");
        });
        div.appendChild(btn);

        tagContainer.appendChild(div);
    });
}

function removeTag(tag, type) {
    if (type == 'ingredient') listOfIngredientsTags = listOfIngredientsTags.filter(item => item !== tag);
    if (type == 'appliance') listOfAppliancesTags = listOfAppliancesTags.filter(item => item !== tag);
    if (type == 'ustensil') listOfUstensilsTags = listOfUstensilsTags.filter(item => item !== tag);
    displayTags();
    search();
}

async function searchInIngredientsTags(value) {
    const searchTerm = value.toLowerCase();
    const suggestions = initialIngredientsList;
    const filteredSuggestions = suggestions.filter(suggestion => suggestion.toLowerCase().includes(searchTerm));
    displayIngredients(filteredSuggestions.map(suggestion => suggestion.charAt(0).toUpperCase() + suggestion.slice(1)));
}

async function searchInAppliancesTags(value) {
    const searchTerm = value.toLowerCase();
    const suggestions = initialAppliancesList;
    const filteredSuggestions = suggestions.filter(suggestion => suggestion.toLowerCase().includes(searchTerm));
    displayAppliances(filteredSuggestions.map(suggestion => suggestion.charAt(0).toUpperCase() + suggestion.slice(1)));
}

async function searchInUstensilsTags(value) {
    const searchTerm = value.toLowerCase();
    const suggestions = initialUstensilsList;
    const filteredSuggestions = suggestions.filter(suggestion => suggestion.toLowerCase().includes(searchTerm));
    displayUstensils(filteredSuggestions.map(suggestion => suggestion.charAt(0).toUpperCase() + suggestion.slice(1)));
}

import recipes from '../data/recipes.js';

let searchResult = recipes;
let listOfIngredientsTags = [];
let listOfAppliancesTags = [];
let listOfUstensilsTags = [];
let initialIngredientsList = [];
let initialAppliancesList = [];
let initialUstensilsList = [];

// Remplissage des listes initiales avec toutes les valeurs uniques
for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    const ingredients = recipe.ingredients;
    const ustensils = recipe.ustensils;

    for (let j = 0; j < ingredients.length; j++) {
        const ingredient = ingredients[j].ingredient.toLowerCase();
        if (!initialIngredientsList.includes(ingredient)) {
            initialIngredientsList.push(ingredient);
        }
    }

    const appliance = recipe.appliance.toLowerCase();
    if (!initialAppliancesList.includes(appliance)) {
        initialAppliancesList.push(appliance);
    }

    for (let k = 0; k < ustensils.length; k++) {
        const ustensil = ustensils[k].toLowerCase();
        if (!initialUstensilsList.includes(ustensil)) {
            initialUstensilsList.push(ustensil);
        }
    }
}


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
    for (let i = 0; i < dropdowns.length; i++) {
        const element = dropdowns[i];

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
    }

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
        const lowerCaseRecipeUstensils = [];
        for (let i = 0; i < recipe.ustensils.length; i++) {
            lowerCaseRecipeUstensils.push(recipe.ustensils[i].toLowerCase());
        }
        const lowerCaseRecipeIngredients = [];
        for (let j = 0; j < recipe.ingredients.length; j++) {
            lowerCaseRecipeIngredients.push(recipe.ingredients[j].ingredient.toLowerCase());
        }
        const lowerCaseRecipeIngredientsTags = [];
        for (let k = 0; k < listOfIngredientsTags.length; k++) {
            lowerCaseRecipeIngredientsTags.push(listOfIngredientsTags[k].toLowerCase());
        }
        const lowerCaseRecipeAppliancesTags = [];
        for (let l = 0; l < listOfAppliancesTags.length; l++) {
            lowerCaseRecipeAppliancesTags.push(listOfAppliancesTags[l].toLowerCase());
        }
        const lowerCaseRecipeUstensilsTags = [];
        for (let m = 0; m < listOfUstensilsTags.length; m++) {
            lowerCaseRecipeUstensilsTags.push(listOfUstensilsTags[m].toLowerCase());
        }

        // Check if there is a matching recipe name, description, ingredient or tag
        const hasMatchingRecipeName = lowerCaseRecipeName.includes(searchTerm);
        const hasMatchingRecipeDescription = lowerCaseRecipeDescription.includes(searchTerm);

        // Check if all tags are present in the recipe
        let hasMatchingIngredientsTags = true;
        for (let i = 0; i < lowerCaseRecipeIngredientsTags.length; i++) {
            const tag = lowerCaseRecipeIngredientsTags[i];
            let foundMatch = false;
            for (let j = 0; j < lowerCaseRecipeIngredients.length; j++) {
                const ingredient = lowerCaseRecipeIngredients[j];
                if (ingredient === tag) {
                    foundMatch = true;
                    break;
                }
            }
            if (!foundMatch) {
                hasMatchingIngredientsTags = false;
                break;
            }
        }

        // Check if at least one ingredient matches the search term
        let hasMatchingRecipeIngredients = true;
        for (let i = 0; i < lowerCaseRecipeIngredients.length; i++) {
            const ingredient = lowerCaseRecipeIngredients[i];
            if (!ingredient.includes(searchTerm)) {
                hasMatchingRecipeIngredients = false;
                break;
            }
        }

        let hasMatchingUstensilsTags = true;
        for (let i = 0; i < lowerCaseRecipeUstensilsTags.length; i++) {
            const tag = lowerCaseRecipeUstensilsTags[i];
            let found = false;
            for (let j = 0; j < lowerCaseRecipeUstensils.length; j++) {
                const ustensil = lowerCaseRecipeUstensils[j];
                if (ustensil === tag) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                hasMatchingUstensilsTags = false;
                break;
            }
        }

        // Check if at least one appliance tag matches the recipe appliance
        let hasMatchingAppliancesTags = true;
        for (let i = 0; i < lowerCaseRecipeAppliancesTags.length; i++) {
            const tag = lowerCaseRecipeAppliancesTags[i];
            if (lowerCaseRecipeAppliance !== tag) {
                hasMatchingAppliancesTags = false;
                break;
            }
        }

        // Return the recipe if it matches the search term, has matching tags, and has matching ingredients
        return ((hasMatchingRecipeName || hasMatchingRecipeDescription || hasMatchingRecipeIngredients) && hasMatchingIngredientsTags && hasMatchingAppliancesTags && hasMatchingUstensilsTags);
    });
    if (searchResult.length === 0) {
        console.log("Aucune recette trouvée");
    }
    displayRecipes(searchResult);
    // Update initialIngredientsList, initialAppliancesList, initialUstensilsList
    let ingredientsList = [];
    let appliancesList = [];
    let ustensilsList = [];
    for (let i = 0; i < searchResult.length; i++) {
        appliancesList.push(searchResult[i].appliance);
        ustensilsList.push(searchResult[i].ustensils);
        let ingredientList = [];
        for (let u = 0; u < searchResult[i].ingredients.length; u++) {
            ingredientList.push(searchResult[i].ingredients[u].ingredient);
        }
        ingredientsList.push(ingredientList);
    }
    initialIngredientsList = [...new Set(ingredientsList)];
    initialAppliancesList = [...new Set(appliancesList)];
    initialUstensilsList = [... new Set(ustensilsList)];
}

function displayRecipes(recettes) {
    const cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = '';
    for (let i = 0; i < recettes.length; i++) {
        const recipe = recettes[i];
        const card = document.createElement("div");
        card.className = "card";

        const thumb = document.createElement("div");
        thumb.className = "thumb";
        card.appendChild(thumb);

        const cardContent = document.createElement("div");
        cardContent.className = "cardContent";
        card.appendChild(cardContent);

        const cardTitle = document.createElement("div");
        cardTitle.className = "cardTitle";
        cardContent.appendChild(cardTitle);

        const h2 = document.createElement("h2");
        h2.textContent = recipe.name;
        cardTitle.appendChild(h2);

        const timer = document.createElement("div");
        timer.className = "timer";
        cardTitle.appendChild(timer);

        const clockIcon = document.createElement("i");
        clockIcon.className = "fa-regular fa-clock";
        timer.appendChild(clockIcon);

        const p = document.createElement("p");
        p.textContent = recipe.time + " min";
        timer.appendChild(p);

        const cardDescription = document.createElement("div");
        cardDescription.className = "cardDescription";
        cardContent.appendChild(cardDescription);

        const ul = document.createElement("ul");
        cardDescription.appendChild(ul);

        const ingredients = recipe.ingredients;
        for (let j = 0; j < ingredients.length; j++) {
            const element = ingredients[j];
            const li = document.createElement("li");

            if (element.quantity) {
                const quantityString = element.quantity + (element.unit ? ` ${element.unit}` : '');
                li.innerHTML = `<b>${element.ingredient}</b>: ${quantityString}`;
            } else {
                li.innerHTML = `<b>${element.ingredient}</b>`;
            }

            ul.appendChild(li);
        }

        const description = document.createElement("p");
        description.textContent = recipe.description;
        cardDescription.appendChild(description);

        cardsContainer.appendChild(card);
    }

    getIngredientsTag(recettes);
    getAppliancesTag(recettes);
    getUstensilsTag(recettes);
}


function getIngredientsTag(search) {
    const listOfIngredients = [];

    for (let i = 0; i < search.length; i++) {
        const element = search[i];
        const ingredients = element.ingredients;

        for (let j = 0; j < ingredients.length; j++) {
            const ingredient = ingredients[j].ingredient;
            listOfIngredients.push(ingredient);
        }
    }

    const uniqueIngredients = [...new Set(listOfIngredients)];
    displayIngredients(uniqueIngredients);
}

function getAppliancesTag(search) {
    const listOfAppliances = [];
    for (let i = 0; i < search.length; i++) {
        const element = search[i];
        listOfAppliances.push(element.appliance);
    }

    const uniqueAppliances = [...new Set(listOfAppliances)];
    displayAppliances(uniqueAppliances);
}

function getUstensilsTag(search) {
    const listOfUstensils = [];

    for (let i = 0; i < search.length; i++) {
        const element = search[i];
        const ustensils = element.ustensils;

        for (let j = 0; j < ustensils.length; j++) {
            const ustensil = ustensils[j];
            listOfUstensils.push(ustensil);
        }
    }

    const uniqueUstensils = [...new Set(listOfUstensils)];
    displayUstensils(uniqueUstensils);
}

function displayUstensils(list) {
    const datalist = document.querySelector('#searchSuggestionUstensil');
    datalist.innerHTML = '';

    for (let i = 0; i < list.length; i++) {
        const suggestion = list[i];

        const element = document.createElement('li');

        const button = document.createElement('button');
        button.classList.add('tagBouton');
        button.id = suggestion;
        button.textContent = suggestion;

        button.onclick = function () {
            addTagUstensil(suggestion);
        };

        element.appendChild(button);
        datalist.appendChild(element);
    }

}

function displayAppliances(list) {
    const datalist = document.querySelector('#searchSuggestionAppliance');
    datalist.innerHTML = '';

    for (let i = 0; i < list.length; i++) {
        const suggestion = list[i];

        const element = document.createElement('li');

        const button = document.createElement('button');
        button.classList.add('tagBouton');
        button.id = suggestion;
        button.textContent = suggestion;

        button.onclick = function () {
            addTagAppliance(suggestion);
        };

        element.appendChild(button);
        datalist.appendChild(element);
    }

}

function displayIngredients(list) {
    const datalist = document.querySelector('#searchSuggestionIngredient');
    datalist.innerHTML = '';

    for (let i = 0; i < list.length; i++) {
        const suggestion = list[i];

        const element = document.createElement('li');

        const button = document.createElement('button');
        button.classList.add('tagBouton');
        button.id = suggestion;
        button.textContent = suggestion;

        button.onclick = function () {
            addTagIngredient(suggestion);
        };

        element.appendChild(button);
        datalist.appendChild(element);
    }

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

    for (let i = 0; i < listOfIngredientsTags.length; i++) {
        const tag = listOfIngredientsTags[i];

        const div = document.createElement('div');
        div.classList.add('tag', 'ingredient');

        const tagName = document.createElement('p');
        tagName.textContent = tag;
        div.appendChild(tagName);

        const btn = document.createElement('button');
        btn.id = tag;
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        btn.addEventListener('click', function () {
            removeTag(tag, 'ingredient');
        });

        div.appendChild(btn);

        tagContainer.appendChild(div);
    }


    for (let i = 0; i < listOfAppliancesTags.length; i++) {
        const tag = listOfAppliancesTags[i];

        const div = document.createElement('div');
        div.classList.add('tag', 'appliance');

        const tagName = document.createElement('p');
        tagName.textContent = tag;
        div.appendChild(tagName);

        const btn = document.createElement('button');
        btn.id = tag;
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        btn.addEventListener('click', function () {
            removeTag(tag, 'appliance');
        });

        div.appendChild(btn);

        tagContainer.appendChild(div);
    }


    for (let i = 0; i < listOfUstensilsTags.length; i++) {
        const tag = listOfUstensilsTags[i];

        const div = document.createElement('div');
        div.classList.add('tag', 'ustensil');

        const tagName = document.createElement('p');
        tagName.textContent = tag;
        div.appendChild(tagName);

        const btn = document.createElement('button');
        btn.id = tag;
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        btn.addEventListener('click', function () {
            removeTag(tag, 'ustensil');
        });

        div.appendChild(btn);

        tagContainer.appendChild(div);
    }

}

function removeTag(tag, type) {
    if (type === 'ingredient') {
        const updatedIngredientsTags = [];
        for (let i = 0; i < listOfIngredientsTags.length; i++) {
            if (listOfIngredientsTags[i] !== tag) {
                updatedIngredientsTags.push(listOfIngredientsTags[i]);
            }
        }
        listOfIngredientsTags = updatedIngredientsTags;
    }

    if (type === 'appliance') {
        const updatedAppliancesTags = [];
        for (let i = 0; i < listOfAppliancesTags.length; i++) {
            if (listOfAppliancesTags[i] !== tag) {
                updatedAppliancesTags.push(listOfAppliancesTags[i]);
            }
        }
        listOfAppliancesTags = updatedAppliancesTags;
    }

    if (type === 'ustensil') {
        const updatedUstensilsTags = [];
        for (let i = 0; i < listOfUstensilsTags.length; i++) {
            if (listOfUstensilsTags[i] !== tag) {
                updatedUstensilsTags.push(listOfUstensilsTags[i]);
            }
        }
        listOfUstensilsTags = updatedUstensilsTags;
    }

    displayTags();
    search();
}

async function searchInIngredientsTags(value) {
    const searchTerm = value.toLowerCase();
    const suggestions = initialIngredientsList;
    const filteredSuggestions = [];
    for (let i = 0; i < suggestions.length; i++) {
        const suggestion = suggestions[i];
        if (suggestion.toLowerCase().includes(searchTerm)) {
            filteredSuggestions.push(suggestion.charAt(0).toUpperCase() + suggestion.slice(1));
        }
    }
    displayIngredients(filteredSuggestions);
}


async function searchInAppliancesTags(value) {
    const searchTerm = value.toLowerCase();
    const suggestions = initialAppliancesList;
    const filteredSuggestions = [];
    for (let i = 0; i < suggestions.length; i++) {
        const suggestion = suggestions[i];
        if (suggestion.toLowerCase().includes(searchTerm)) {
            filteredSuggestions.push(suggestion.charAt(0).toUpperCase() + suggestion.slice(1));
        }
    }
    displayAppliances(filteredSuggestions);
}


async function searchInUstensilsTags(value) {
    const searchTerm = value.toLowerCase();
    const suggestions = initialUstensilsList;
    const filteredSuggestions = [];
    for (let i = 0; i < suggestions.length; i++) {
        const suggestion = suggestions[i];
        if (suggestion.toLowerCase().includes(searchTerm)) {
            filteredSuggestions.push(suggestion.charAt(0).toUpperCase() + suggestion.slice(1));
        }
    }
    displayUstensils(filteredSuggestions);
}

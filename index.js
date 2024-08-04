const craftingRecipes = [
    {
        id: 1,
        character: { name: 'Ember', image: 'placeholder.png' },
        materials: [
            { name: 'Wood', required: 10 },
            { name: 'Stone', required: 5 },
            { name: 'Iron', required: 2 },
            { name: 'Gold', required: 1 }
        ]
    },
    {
        id: 2,
        character: { name: 'Frostbite', image: 'placeholder.png' },
        materials: [
            { name: 'Wood', required: 8 },
            { name: 'Stone', required: 7 },
            { name: 'Iron', required: 4 },
            { name: 'Gold', required: 2 }
        ]
    },
    {
        id: 3,
        character: { name: 'Spark', image: 'placeholder.png' },
        materials: [
            { name: 'Wood', required: 6 },
            { name: 'Stone', required: 4 },
            { name: 'Iron', required: 3 },
            { name: 'Gold', required: 2 }
        ]
    },
];


const characters = [
    { id: 1, name: 'Ember', image: 'placeholder.png' },
    { id: 2, name: 'Frostbite', image: 'placeholder.png' },
    { id: 3, name: 'Spark', image: 'placeholder.png' },
    
];

const ownedCharacters = ['Ember'];



const playerMaterials = {
    Wood: 15,
    Stone: 3,
    Iron: 4,
    Gold: 0
};

function showShopPopup() {
    const popup = document.getElementById('shopPopup');
    popup.style.display = 'block';
    populateShopItems();
}

function hideShopPopup() {
    const popup = document.getElementById('shopPopup');
    popup.style.display = 'none';
}

function showCharacterPopup() {
    const popup = document.getElementById('characterPopup');
    popup.style.display = 'block';
    populateCharacterItems();
}

function hideCharacterPopup() {
    const popup = document.getElementById('characterPopup');
    popup.style.display = 'none';
}

function showCraftingPopup() {
    const popup = document.getElementById('craftingPopup');
    popup.style.display = 'block';
    populateCraftingItems();
}

function hideCraftingPopup() {
    const popup = document.getElementById('craftingPopup');
    popup.style.display = 'none';
}

function startGame() {
    window.location.href = '/game.html';

    
}

function button5Action() {
    alert('Don\'t bother with this. Social isn\'t going to work for a while.')
    
}

function handleShopItemClick(itemId) {
    console.log(`Item ${itemId} selected`);
    
    switch (itemId) {
        case 1:
            alert('Item 1 selected');
            break;
        case 2:
            alert('Item 2 selected');
            break;
        
        default:
            alert("A wild error appeared!");
    }
}

function handleCharacterItemClick(itemId) {
    console.log(`Character ${itemId} selected`);
    
    switch (itemId) {
        case 1:
            if (ownedCharacters.includes('Ember')) {
                localStorage.setItem('vulgarian', "Ember")
                alert('Successfully Switched to Ember');
            }
            else {
                alert('You don\'t own Ember');
            }
            break;
        case 2:
            if (ownedCharacters.includes('Frostbite')) {
                localStorage.setItem('vulgarian', "Frostbite")
                alert('Successfully Switched to Frostbite');
            }
            else {
                alert('You don\'t own Frostbite');
            }
            break;
        case 2:
            if (ownedCharacters.includes('Spark')) {
                localStorage.setItem('vulgarian', "Spark")
                alert('Successfully Switched to Spark');
            }
            else {
                alert('You don\'t own Spark');
            }
            break;
        
        default:
            alert("A wild error appeared!");
    }
}

function handleCraftingItemClick(recipeId) {
    console.log(`Crafting Recipe ${recipeId} selected`);

    const recipe = craftingRecipes.find(r => r.id === recipeId);
    if (!recipe) {
        alert('Recipe not found!');
        return;
    }

    const craftingItemsContainer = document.querySelector('.crafting-items');
    craftingItemsContainer.innerHTML = ''; 

    const title = document.createElement('h2');
    title.className = 'crafting-title';
    title.textContent = `Craft ${recipe.character.name}`;

    const image = document.createElement('img');
    image.className = 'crafting-image';
    image.src = recipe.character.image;
    image.alt = recipe.character.name;

    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';

    recipe.materials.forEach(material => {
        const textSlot = document.createElement('div');
        textSlot.className = 'text-slot';
        const playerAmount = playerMaterials[material.name] || 0;
        textSlot.textContent = `${material.name}: ${playerAmount} / ${material.required}`;
        textContainer.appendChild(textSlot);
    });

    const button = document.createElement('button');
    button.className = 'crafting-button';
    button.textContent = 'Craft';
    button.onclick = () => alert(`${recipe.character.name} crafted!`);

    craftingItemsContainer.appendChild(title);
    craftingItemsContainer.appendChild(image);
    craftingItemsContainer.appendChild(textContainer);
    craftingItemsContainer.appendChild(button);

    const popup = document.getElementById('craftingPopup');
    popup.scrollTop = 0; 
    popup.style.display = 'block';
}

function populateShopItems() {
    const shopItemsContainer = document.querySelector('.shop-items');
    shopItemsContainer.innerHTML = ''; 

    for (let i = 1; i <= 9; i++) {
        const item = document.createElement('div');
        item.className = 'popup-item';

        const itemText = document.createElement('p');
        itemText.textContent = `Item ${i}`;

        const itemImage = document.createElement('img');
        itemImage.src = `placeholder.png`;
        itemImage.alt = `Item ${i}`;

        const itemButton = document.createElement('button');
        itemButton.textContent = 'Select';
        itemButton.setAttribute('onclick', `handleShopItemClick(${i})`);

        item.appendChild(itemText);
        item.appendChild(itemImage);
        item.appendChild(itemButton);

        shopItemsContainer.appendChild(item);
    }
}

function populateCharacterItems() {
    const characterItemsContainer = document.querySelector('.character-items');
    characterItemsContainer.innerHTML = ''; 

    craftingRecipes.forEach((recipe) => {
        const item = document.createElement('div');
        item.className = 'popup-item';

        const itemText = document.createElement('p');
        itemText.textContent = recipe.character.name;

        const itemImage = document.createElement('img');
        itemImage.src = recipe.character.image;
        itemImage.alt = recipe.character.name;

        const itemButton = document.createElement('button');
        itemButton.textContent = 'Select';
        itemButton.setAttribute('onclick', `handleCharacterItemClick(${recipe.id})`);

        item.appendChild(itemText);
        item.appendChild(itemImage);
        item.appendChild(itemButton);

        characterItemsContainer.appendChild(item);
    });
}

function populateCraftingItems() {
    const craftingItemsContainer = document.querySelector('.crafting-items');
    craftingItemsContainer.innerHTML = ''; 

    craftingRecipes.forEach((recipe) => {
        const item = document.createElement('div');
        item.className = 'popup-item';

        const itemText = document.createElement('p');
        itemText.textContent = `${recipe.character.name}`;

        const itemImage = document.createElement('img');
        itemImage.src = recipe.character.image;
        itemImage.alt = recipe.character.name;

        const itemButton = document.createElement('button');
        itemButton.textContent = 'Select';
        itemButton.setAttribute('onclick', `handleCraftingItemClick(${recipe.id})`);

        item.appendChild(itemText);
        item.appendChild(itemImage);
        item.appendChild(itemButton);

        craftingItemsContainer.appendChild(item);
    });
}
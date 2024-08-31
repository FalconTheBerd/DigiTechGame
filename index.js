const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

window.addEventListener('load', function() {
    if (isMobileDevice()) {
        if (!isStandalone()) {
            if (isLocal) {
                window.location.href = `webapp.html`;
            } else {
                window.location.href = `/DigiTechGame/webapp.html`;
            }
        } else {
            console.log('Mobile in Standalone')
        }
    } else {
        console.log('Not a mobile device');
    }
});

function isMobileDevice() {
    return /iPad|iPhone|iPod|Android|Windows Phone|Mobile|Tablet/i.test(navigator.userAgent);
}

function isStandalone() {
    return (window.navigator.standalone === true) || (window.matchMedia('(display-mode: standalone)').matches);
}





if (!localStorage.getItem('vulgarian')){
    localStorage.setItem('vulgarian', 'Ember');

}

const craftingRecipes = [
    {
        id: 1,
        character: { name: 'Frostbite', image: 'placeholder.png' },
        materials: [
            { name: 'Gold', required: 100 },
            { name: 'Ice Heart', required: 1 },
            { name: 'Exo Suit Part', required: 15 },
            { name: 'Temperature Stabiliser', required: 10 }
        ]
    },
    {
        id: 2,
        character: { name: 'Spark', image: 'placeholder.png' },
        materials: [
            { name: 'Wood', required: 8 },
            { name: 'Stone', required: 7 },
            { name: 'Iron', required: 4 },
            { name: 'Gold', required: 2 }
        ]
    },
];

let ownedCharacters = JSON.parse(localStorage.getItem('ownedCharacters')) || [];
if (!ownedCharacters.length) {
    ownedCharacters.push('Ember');
    localStorage.setItem('ownedCharacters', JSON.stringify(ownedCharacters));
}

const characters = [
    { id: 1, name: 'Ember', image: 'https://lh3.googleusercontent.com/d/1yj49UljxenjqOEWE6QQK5szC-mJMCtxy' },
    { id: 2, name: 'Frostbite', image: 'placeholder.png' },
    { id: 3, name: 'Spark', image: 'placeholder.png' },
];

let playerMaterials = JSON.parse(localStorage.getItem('inventory')) || {};

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
    if (isLocal) {
        window.location.href = `game.html`;
    } else {
        window.location.href = `/DigiTechGame/game.html`;
    }
}

function button5Action() {
    window.close();
}

function handleShopItemClick(itemId) {
    console.log(`Item ${itemId} selected`);

    switch (itemId) {
        case 1:
            window.location.href = "buyItem.html?id=" + encodeURIComponent(itemId);
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

    let characterName = characters.find(c => c.id === itemId)?.name;
    let ownedCharacters = localStorage.getItem('ownedCharacters');

    if (characterName && ownedCharacters.includes(characterName)) {
        localStorage.setItem('vulgarian', characterName);
        alert(`Successfully switched to ${characterName}`);
    } else {
        alert(`You don't own ${characterName}`);
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

    let canCraft = true;
    const inventory = JSON.parse(localStorage.getItem('inventory')) || {};

    recipe.materials.forEach(material => {
        const textSlot = document.createElement('div');
        textSlot.className = 'text-slot';
        const playerAmount = inventory[material.name] || 0;
        textSlot.textContent = `${material.name}: ${playerAmount} / ${material.required}`;
        textContainer.appendChild(textSlot);

        if (playerAmount < material.required) {
            canCraft = false;
        }
    });

    const button = document.createElement('button');
    button.className = 'crafting-button';
    button.textContent = canCraft ? 'Craft' : 'Not enough materials';
    button.disabled = !canCraft;

    if (canCraft) {
        button.onclick = () => {
            
            recipe.materials.forEach(material => {
                inventory[material.name] -= material.required;
            });
    
            
            localStorage.setItem('inventory', JSON.stringify(inventory));
    
            
            let ownedCharacters = JSON.parse(localStorage.getItem('ownedCharacters')) || [];
            ownedCharacters.push(recipe.character.name);
            localStorage.setItem('ownedCharacters', JSON.stringify(ownedCharacters));
    
            alert(`${recipe.character.name} crafted!`);
        };
    }    

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
        itemImage.src = 'placeholder.png';
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

    const ownedCharacters = JSON.parse(localStorage.getItem('ownedCharacters')) || [];

    characters.forEach((character) => {
        const item = document.createElement('div');
        item.className = 'popup-item';

        const itemText = document.createElement('p');
        itemText.textContent = character.name;

        const itemImage = document.createElement('img');
        itemImage.src = character.image;
        itemImage.alt = character.name;

        const itemButton = document.createElement('button');
        itemButton.textContent = 'Select';
        itemButton.setAttribute('onclick', `handleCharacterItemClick(${character.id})`);

        item.appendChild(itemText);
        item.appendChild(itemImage);

        
        if (ownedCharacters.includes(character.name)) {
            const ownedIndicator = document.createElement('span');
            ownedIndicator.textContent = '✔ Owned';
            ownedIndicator.className = 'owned-indicator';
            item.appendChild(ownedIndicator);
        }

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

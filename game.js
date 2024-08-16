document.addEventListener('DOMContentLoaded', (event) => {
    let mouseX, mouseY;

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    document.onkeydown = function (evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape) {
            if (isLocal) {
                window.location.href = `index.html`;
            } else {
                window.location.href = `/DigiTechGame/index.html`;
            }
        }
    };

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    const player = document.getElementById('player');
    const moveAmount = 5;

    const keysPressed = {};

    // Ability UI Elements
    const abilityUIElements = {
        ability1: document.getElementById('cooldown1'),
        ability2: document.getElementById('cooldown2'),
        ability3: document.getElementById('cooldown3'),
        ability4: document.getElementById('cooldown4')
    };

    function setPlayerImage(vulgarian) {
        switch (vulgarian) {
            case 'Ember':
                player.style.backgroundImage = 'url(https://lh3.googleusercontent.com/d/1yj49UljxenjqOEWE6QQK5szC-mJMCtxy)';
                break;
            case 'Frostbite':
                player.style.backgroundImage = 'url(placeholder.png)';
                break;
            default:
                player.style.backgroundImage = 'url(placeholder.png)';
                break;
        }
    }

    function setAbilityIcons(vulgarian) {
        const characterAbilities = abilities[vulgarian];
        if (characterAbilities) {
            const abilityNames = Object.keys(characterAbilities);
            abilityNames.forEach((abilityName, index) => {
                const elementKey = `ability${index + 1}`;
                const iconElement = document.getElementById(`${elementKey}-icon`);
                if (iconElement) {
                    iconElement.src = characterAbilities[abilityName].icon || 'placeholder.png';
                }
            });
        }
    }

    const vulgarian = localStorage.getItem('vulgarian');
    if (vulgarian) {
        setPlayerImage(vulgarian);
        setAbilityIcons(vulgarian);
    }

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key.toUpperCase()] = true;

        const vulgarian = localStorage.getItem('vulgarian');
        if (vulgarian) {
            const characterAbilities = abilities[vulgarian];

            const abilityKeyMap = {
                'Q': Object.keys(characterAbilities)[0],
                'X': Object.keys(characterAbilities)[1],
                'C': Object.keys(characterAbilities)[2],
                'V': Object.keys(characterAbilities)[3]
            };

            const abilityName = abilityKeyMap[event.key.toUpperCase()];
            if (abilityName && characterAbilities[abilityName]) {
                useAbility(abilityName, event);
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        keysPressed[event.key.toUpperCase()] = false;
    });

    function movePlayer() {
        const style = window.getComputedStyle(player);
        let top = parseInt(style.top);
        let left = parseInt(style.left);

        let verticalMove = 0;
        let horizontalMove = 0;

        if (keysPressed['ARROWUP'] || keysPressed['W']) {
            verticalMove -= moveAmount;
        }
        if (keysPressed['ARROWDOWN'] || keysPressed['S']) {
            verticalMove += moveAmount;
        }
        if (keysPressed['ARROWLEFT'] || keysPressed['A']) {
            horizontalMove -= moveAmount;
        }
        if (keysPressed['ARROWRIGHT'] || keysPressed['D']) {
            horizontalMove += moveAmount;
        }

        if (verticalMove !== 0 && horizontalMove !== 0) {
            verticalMove *= Math.sqrt(0.5);
            horizontalMove *= Math.sqrt(0.5);
        }

        top = Math.max(0, Math.min(window.innerHeight - player.clientHeight, top + verticalMove));
        left = Math.max(0, Math.min(window.innerWidth - player.clientWidth, left + horizontalMove));

        player.style.top = `${top}px`;
        player.style.left = `${left}px`;

        const shield = document.querySelector('.thermalShield');
        if (shield) {
            shield.style.top = `${top + (player.clientHeight / 2) - (shield.clientHeight / 2)}px`;
            shield.style.left = `${left + (player.clientWidth / 2) - (shield.clientWidth / 2)}px`;
        }

        requestAnimationFrame(movePlayer);
    }

    // Function `useAbility`, `startCooldown`, etc., are now from abilities.js

    function createDungeonNode(name, top, left, estimatedTime, page) {
        const dungeonNode = document.createElement('div');
        dungeonNode.className = 'dungeonNode';
        dungeonNode.style.width = '50px';
        dungeonNode.style.height = '50px';
        dungeonNode.style.backgroundColor = 'blue';
        dungeonNode.style.position = 'absolute';
        dungeonNode.style.top = `${top}px`;
        dungeonNode.style.left = `${left}px`;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.display = 'none';
        tooltip.textContent = `Dungeon: ${name}\nEstimated Time: ${estimatedTime}`;
        document.body.appendChild(tooltip);

        dungeonNode.addEventListener('mouseover', () => {
            tooltip.style.display = 'block';
            tooltip.style.top = `${parseInt(dungeonNode.style.top) - 40}px`;
            tooltip.style.left = `${parseInt(dungeonNode.style.left) + 60}px`;
        });

        dungeonNode.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });

        dungeonNode.addEventListener('click', () => {
            if (isLocal) {
                window.location.href = `${page}.html`;
            } else {
                window.location.href = `/DigiTechGame/${page}.html`;
            }
        });

        document.body.appendChild(dungeonNode);
    }

    createDungeonNode('New Beginnings', 200, 50, '1 min', 'newBeginnings');
    createDungeonNode('Ancient Ruins', 400, 50, '30 mins', 'ancientRuins');
    createDungeonNode('Haunted Forest', 600, 50, '25 mins', 'hauntedForest');

    requestAnimationFrame(movePlayer);
});

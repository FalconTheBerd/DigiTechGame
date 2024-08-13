document.addEventListener('DOMContentLoaded', (event) => {
    let mouseX, mouseY;

    
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    const player = document.getElementById('player');
    const moveAmount = 5;

    const keysPressed = {};

    const abilities = {
        Ember: {
            flameBarrage: {
                icon: 'https://lh3.googleusercontent.com/d/14qnxoecbnvyX5KMQcj5syAMHnt5TLwKw',
                cooldown: 5000,
                lastUsed: 0,
                action: function (event) {
                    flameBarrage(event);
                }
            },
            fireball: {
                icon: 'https://lh3.googleusercontent.com/d/10RVm0LvavPzB20L_I_9ZsmH4Mso655dZ',
                cooldown: 3000,
                lastUsed: 0,
                action: function (event) {
                    fireball(event);
                }
            },
            thermalShield: {
                icon: 'https://lh3.googleusercontent.com/d/1nQU0tmEG1Z__sT4DfuFkjdnfgTeNtPgc',
                cooldown: 15000,
                lastUsed: 0,
                action: function () {
                    thermalShield();
                }
            },
            flameWave: {
                icon: 'https://lh3.googleusercontent.com/d/13pizwOJhLPj7u1AwcizkxUp-1Nt8rQUJ',
                cooldown: 10000,
                lastUsed: 0,
                action: function (event) {
                    flameWave(event);
                }
            }
        },
        
    };

    const abilityUIElements = {
        flameBarrage: document.getElementById('cooldown1'),
        fireball: document.getElementById('cooldown2'),
        thermalShield: document.getElementById('cooldown3'),
        flameWave: document.getElementById('cooldown4')
    };

    function setPlayerImage(vulgarian) {
        switch (vulgarian) {
            case 'Ember':
                player.style.backgroundImage = 'url(https://lh3.googleusercontent.com/d/1yj49UljxenjqOEWE6QQK5szC-mJMCtxy)';
                break;
            default:
                player.style.backgroundImage = 'url(placeholder.png)';
                break;
        }
    }

    function setAbilityIcons(vulgarian) {
        const characterAbilities = abilities[vulgarian];
        if (characterAbilities) {
            document.getElementById('ability1-icon').src = characterAbilities.flameBarrage.icon;
            document.getElementById('ability2-icon').src = characterAbilities.fireball.icon;
            document.getElementById('ability3-icon').src = characterAbilities.thermalShield.icon;
            document.getElementById('ability4-icon').src = characterAbilities.flameWave.icon;
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

        if (event.key.toUpperCase() === 'Q') {
            if (vulgarian === "Ember") {
                useAbility('flameBarrage', event);
            } else {
                alert('A wild error appeared!');
            }
        } else if (event.key.toUpperCase() === 'X') {
            if (vulgarian === "Ember") {
                useAbility('fireball', event);
            } else {
                alert('A wild error appeared!');
            }
        } else if (event.key.toUpperCase() === 'C') {
            if (vulgarian === "Ember") {
                useAbility('thermalShield', event);
            } else {
                alert('A wild error appeared!');
            }
        } else if (event.key.toUpperCase() === 'V') {
            if (vulgarian === "Ember") {
                useAbility('flameWave', event);
            } else {
                alert('A wild error appeared!');
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
        if (keysPressed['ARROWRIGHT'] || keysPressed['D']){
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

    function useAbility(abilityName, event) {
        const vulgarian = localStorage.getItem('vulgarian');
        const characterAbilities = abilities[vulgarian];
        const ability = characterAbilities[abilityName];
        const currentTime = Date.now();

        if (currentTime - ability.lastUsed >= ability.cooldown) {
            ability.lastUsed = currentTime;
            ability.action(event);
            startCooldown(abilityName, ability.cooldown);
        } else {
            console.log(`${abilityName} is on cooldown.`);
        }
    }

    function startCooldown(abilityName, cooldown) {
        const cooldownElement = abilityUIElements[abilityName];
        if (cooldownElement) {
            console.log(`Starting cooldown for ${abilityName}`);
            cooldownElement.style.opacity = 1;
            cooldownElement.textContent = (cooldown / 1000).toFixed(1);

            const interval = setInterval(() => {
                const timeLeft = parseFloat(cooldownElement.textContent) - 0.1;
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    cooldownElement.style.opacity = 0;
                    cooldownElement.textContent = "0";
                } else {
                    cooldownElement.textContent = timeLeft.toFixed(1);
                }
            }, 100);
        } else {
            console.log(`Cooldown element for ${abilityName} not found`);
        }
    }

    function flameBarrage() {
        const player = document.getElementById('player');
        const playerRect = player.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;

        for (let i = 0; i < 5; i++) {
            const flame = document.createElement('div');
            flame.className = 'flame';
            flame.style.position = 'absolute';
            flame.style.top = `${playerCenterY}px`;
            flame.style.left = `${playerCenterX}px`;
            document.body.appendChild(flame);

            const speed = 5;
            const deltaY = mouseY - playerCenterY;
            const deltaX = mouseX - playerCenterX;

            const offsetAngle = Math.atan2(deltaY, deltaX) + (Math.random() - 0.5) * 0.2;

            function moveFlame() {
                let flameTop = parseFloat(flame.style.top);
                let flameLeft = parseFloat(flame.style.left);

                flameTop += speed * Math.sin(offsetAngle);
                flameLeft += speed * Math.cos(offsetAngle);

                flame.style.top = `${flameTop}px`;
                flame.style.left = `${flameLeft}px`;

                if (flameTop < 0 || flameTop > window.innerHeight || flameLeft < 0 || flameLeft > window.innerWidth) {
                    flame.remove();
                } else {
                    requestAnimationFrame(moveFlame);
                }
            }

            requestAnimationFrame(moveFlame);
        }
    }

    function fireball() {
        const player = document.getElementById('player');
        const playerRect = player.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;

        const angle = Math.atan2(mouseY - playerCenterY, mouseX - playerCenterX);

        const fireball = document.createElement('div');
        fireball.className = 'fireball';
        fireball.style.top = `${playerCenterY}px`;
        fireball.style.left = `${playerCenterX}px`;
        document.body.appendChild(fireball);

        const speed = 10;

        function moveFireball() {
            const fireballTop = parseInt(fireball.style.top);
            const fireballLeft = parseInt(fireball.style.left);
            fireball.style.top = `${fireballTop + speed * Math.sin(angle)}px`;
            fireball.style.left = `${fireballLeft + speed * Math.cos(angle)}px`;

            if (fireballTop < 0 || fireballTop > window.innerHeight || fireballLeft < 0 || fireballLeft > window.innerWidth) {
                fireball.remove();
            } else {
                requestAnimationFrame(moveFireball);
            }
        }

        requestAnimationFrame(moveFireball);
    }

    function thermalShield() {
        const player = document.getElementById('player');

        let shield = document.querySelector('.thermalShield');
        if (!shield) {
            shield = document.createElement('div');
            shield.className = 'thermalShield';
            player.appendChild(shield);
        }

        
        setTimeout(() => {
            if (shield) {
                shield.remove();
            }
        }, 4000);
    }


    function flameWave() {
        const player = document.getElementById('player');
        const playerRect = player.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;

        const angle = Math.atan2(mouseY - playerCenterY, mouseX - playerCenterX);

        for (let i = 0; i < 5; i++) {
            const wave = document.createElement('div');
            wave.className = 'flameWave';
            wave.style.top = `${playerCenterY}px`;
            wave.style.left = `${playerCenterX}px`;
            document.body.appendChild(wave);

            const speed = 3;
            const delay = i * 100; 

            setTimeout(() => {
                function moveWave() {
                    const waveTop = parseInt(wave.style.top);
                    const waveLeft = parseInt(wave.style.left);
                    wave.style.top = `${waveTop + speed * Math.sin(angle)}px`;
                    wave.style.left = `${waveLeft + speed * Math.cos(angle)}px`;

                    if (waveTop < 0 || waveTop > window.innerHeight || waveLeft < 0 || waveLeft > window.innerWidth) {
                        wave.remove();
                    } else {
                        requestAnimationFrame(moveWave);
                    }
                }

                moveWave();
            }, delay);
        }
    }

    
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
            window.location.href = `${page}.html`; 
        });

        document.body.appendChild(dungeonNode);
    }

    
    createDungeonNode('New Beginnings', 300, 300, '20 mins', 'newBeginnings');
    createDungeonNode('Ancient Ruins', 500, 400, '30 mins', 'ancientRuins');
    createDungeonNode('Haunted Forest', 200, 600, '25 mins', 'hauntedForest');

    
    requestAnimationFrame(movePlayer);
});

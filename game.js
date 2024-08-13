document.addEventListener('DOMContentLoaded', (event) => {
    let mouseX, mouseY;

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        var isEscape = false;
        if ("key" in evt) {
            isEscape = (evt.key === "Escape" || evt.key === "Esc");
        } else {
            isEscape = (evt.keyCode === 27);
        }
        if (isEscape) {
            window.location.href = '/index.html'
        }
    };

    
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

    function flameBarrage(event) {
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
    
                // Check for collision with enemies
                let hit = false;
                document.querySelectorAll('.enemy').forEach(enemy => {
                    if (!hit) {
                        const enemyRect = enemy.getBoundingClientRect();
                        if (flameTop >= enemyRect.top && flameTop <= enemyRect.bottom &&
                            flameLeft >= enemyRect.left && flameLeft <= enemyRect.right) {
                            enemy.remove();
                            dropItem(enemy);
                            hit = true;  // Mark as hit
                            flame.remove();
                        }
                    }
                });
    
                // Check for collision with bosses
                if (!hit) {
                    document.querySelectorAll('.boss').forEach(boss => {
                        if (!hit) {
                            const bossRect = boss.getBoundingClientRect();
                            if (flameTop >= bossRect.top && flameTop <= bossRect.bottom &&
                                flameLeft >= bossRect.left && flameLeft <= bossRect.right) {
                                boss.takeDamage(5); // Adjust the damage as needed
                                hit = true;  // Mark as hit
                                flame.remove();
                            }
                        }
                    });
                }
    
                if (!hit && (flameTop < 0 || flameTop > window.innerHeight || flameLeft < 0 || flameLeft > window.innerWidth)) {
                    flame.remove();
                } else if (!hit) {
                    requestAnimationFrame(moveFlame);
                }
            }
    
            requestAnimationFrame(moveFlame);
        }
    }
    
    function fireball(event) {
        const playerRect = player.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;
    
        const angle = Math.atan2(mouseY - playerCenterY, mouseX - playerCenterX);
    
        const fireball = document.createElement('div');
        fireball.className = 'fireball';
        fireball.style.position = 'absolute';
        fireball.style.top = `${playerCenterY}px`;
        fireball.style.left = `${playerCenterX}px`;
        document.body.appendChild(fireball);
    
        const speed = 10;
    
        function moveFireball() {
            const fireballTop = parseInt(fireball.style.top);
            const fireballLeft = parseInt(fireball.style.left);
            fireball.style.top = `${fireballTop + speed * Math.sin(angle)}px`;
            fireball.style.left = `${fireballLeft + speed * Math.cos(angle)}px`;
    
            let hit = false;  // Track whether the fireball has hit something
    
            // Check for collision with the boss
            document.querySelectorAll('.boss').forEach(boss => {
                if (hit) return;  // Exit if already hit
                const bossRect = boss.getBoundingClientRect();
                if (fireballTop >= bossRect.top && fireballTop <= bossRect.bottom &&
                    fireballLeft >= bossRect.left && fireballLeft <= bossRect.right) {
                    boss.takeDamage(30); // Apply correct damage
                    fireball.remove();  // Remove the fireball immediately
                    hit = true;  // Mark as hit to prevent further processing
                }
            });
    
            // Check for collision with enemies
            if (!hit) {  // Only check if it hasn't already hit the boss
                document.querySelectorAll('.enemy').forEach(enemy => {
                    if (hit) return;  // Exit if already hit
                    const enemyRect = enemy.getBoundingClientRect();
                    if (fireballTop >= enemyRect.top && fireballTop <= enemyRect.bottom &&
                        fireballLeft >= enemyRect.left && fireballLeft <= enemyRect.right) {
                        enemy.remove();
                        dropItem(enemy);
                        fireball.remove();  // Remove the fireball immediately
                        hit = true;  // Mark as hit to prevent further processing
                    }
                });
            }
    
            if (!hit) {  // Only continue moving if it hasn't hit anything
                if (fireballTop < 0 || fireballTop > window.innerHeight || fireballLeft < 0 || fireballLeft > window.innerWidth) {
                    fireball.remove();  // Remove fireball if it leaves the screen
                } else {
                    requestAnimationFrame(moveFireball);
                }
            }
        }
    
        requestAnimationFrame(moveFireball);
    }
    
    
    
    function thermalShield() {
        let shield = document.querySelector('.thermalShield');
        if (!shield) {
            shield = document.createElement('div');
            shield.className = 'thermalShield';
            player.appendChild(shield);
        }
    
        // Shield blocks bullets for 4 seconds
        shield.dataset.active = 'true';
    
        setTimeout(() => {
            if (shield) {
                shield.dataset.active = 'false';
                shield.remove();
            }
        }, 4000);
    }
    
    function flameWave(event) {
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
            const delay = i * 100; // Delay each wave
    
            setTimeout(() => {
                let hit = false; // Track if the wave has hit anything
    
                function moveWave() {
                    if (hit) return; // Stop if the wave has already hit something
    
                    const waveTop = parseInt(wave.style.top);
                    const waveLeft = parseInt(wave.style.left);
                    wave.style.top = `${waveTop + speed * Math.sin(angle)}px`;
                    wave.style.left = `${waveLeft + speed * Math.cos(angle)}px`;
    
                    // Check for collision with enemies
                    document.querySelectorAll('.enemy').forEach(enemy => {
                        if (!hit) {
                            const enemyRect = enemy.getBoundingClientRect();
                            if (waveTop >= enemyRect.top && waveTop <= enemyRect.bottom &&
                                waveLeft >= enemyRect.left && waveLeft <= enemyRect.right) {
                                enemy.remove();
                                dropItem(enemy);
                                hit = true; // Mark as hit
                                wave.remove();
                            }
                        }
                    });
    
                    // Check for collision with bosses
                    if (!hit) {
                        document.querySelectorAll('.boss').forEach(boss => {
                            if (!hit) {
                                const bossRect = boss.getBoundingClientRect();
                                if (waveTop >= bossRect.top && waveTop <= bossRect.bottom &&
                                    waveLeft >= bossRect.left && waveLeft <= bossRect.right) {
                                    boss.takeDamage(25); // Adjust the damage as needed
                                    hit = true; // Mark as hit
                                    wave.remove();
                                }
                            }
                        });
                    }
    
                    if (!hit && (waveTop < 0 || waveTop > window.innerHeight || waveLeft < 0 || waveLeft > window.innerWidth)) {
                        wave.remove();
                        hit = true; // Mark as hit if it leaves the screen
                    } else if (!hit) {
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

    
    createDungeonNode('New Beginnings', 700, 50, '20 mins', 'newBeginnings');
    createDungeonNode('Ancient Ruins', 500, 400, '30 mins', 'ancientRuins');
    createDungeonNode('Haunted Forest', 200, 600, '25 mins', 'hauntedForest');

    
    requestAnimationFrame(movePlayer);
});

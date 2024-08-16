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
        Frostbite: {
            iceBlast: {
                icon: 'placeholder.png',
                cooldown: 4000,
                lastUsed: 0,
                action: function (event) {
                    iceBlast(event);
                }
            },
            frostNova: {
                icon: 'placeholder.png',
                cooldown: 8000,
                lastUsed: 0,
                action: function (event) {
                    frostNova(event);
                }
            },
            chillingAura: {
                icon: 'placeholder.png',
                cooldown: 15000,
                lastUsed: 0,
                action: function () {
                    chillingAura();
                }
            },
            glacierStrike: {
                icon: 'placeholder.png',
                cooldown: 10000,
                lastUsed: 0,
                action: function (event) {
                    glacierStrike(event);
                }
            }
        }
    };

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

            // Define the ability key map dynamically based on the character's abilities
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
        const abilityIndex = {
            flameBarrage: 'ability1',
            fireball: 'ability2',
            thermalShield: 'ability3',
            flameWave: 'ability4',
            iceBlast: 'ability1',
            frostNova: 'ability2',
            chillingAura: 'ability3', // Ensure chillingAura is correctly mapped
            glacierStrike: 'ability4'
        };
    
        const cooldownElement = abilityUIElements[abilityIndex[abilityName]];
        if (cooldownElement) {
            console.log(`Starting cooldown for ${abilityName}`);
            cooldownElement.style.opacity = 1;
            cooldownElement.textContent = (cooldown / 1000).toFixed(1);
    
            const interval = setInterval(() => {
                const timeLeft = parseFloat(cooldownElement.textContent) - 0.1;
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    cooldownElement.style.opacity = 0;
                    cooldownElement.textContent = "";
                } else {
                    cooldownElement.textContent = timeLeft.toFixed(1);
                }
            }, 100);
        } else {
            console.log(`Cooldown element for ${abilityName} not found`);
        }
    }
    

    // Ember's Abilities
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

                let hit = false;
                document.querySelectorAll('.enemy').forEach(enemy => {
                    if (!hit) {
                        const enemyRect = enemy.getBoundingClientRect();
                        if (flameTop >= enemyRect.top && flameTop <= enemyRect.bottom &&
                            flameLeft >= enemyRect.left && flameLeft <= enemyRect.right) {
                            enemy.remove();
                            dropItem(enemy);
                            hit = true;
                            flame.remove();
                        }
                    }
                });

                if (!hit) {
                    document.querySelectorAll('.boss').forEach(boss => {
                        if (!hit) {
                            const bossRect = boss.getBoundingClientRect();
                            if (flameTop >= bossRect.top && flameTop <= bossRect.bottom &&
                                flameLeft >= bossRect.left && flameLeft <= bossRect.right) {
                                boss.takeDamage(5);
                                hit = true;
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

        const speed = 5;
        const deltaY = mouseY - playerCenterY;
        const deltaX = mouseX - playerCenterX;

        const offsetAngle = Math.atan2(deltaY, deltaX) + (Math.random() - 0.5) * 0.2;

        function moveFireball() {
            let fireballTop = parseFloat(fireball.style.top);
            let fireballLeft = parseFloat(fireball.style.left);

            fireballTop += speed * Math.sin(offsetAngle);
            fireballLeft += speed * Math.cos(offsetAngle);

            fireball.style.top = `${fireballTop + speed * Math.sin(angle)}px`;
            fireball.style.left = `${fireballLeft + speed * Math.cos(angle)}px`;

            let hit = false;

            document.querySelectorAll('.boss').forEach(boss => {
                if (hit) return;
                const bossRect = boss.getBoundingClientRect();
                if (fireballTop >= bossRect.top && fireballTop <= bossRect.bottom &&
                    fireballLeft >= bossRect.left && fireballLeft <= bossRect.right) {
                    boss.takeDamage(30);
                    fireball.remove();
                    hit = true;
                }
            });

            if (!hit) {
                document.querySelectorAll('.enemy').forEach(enemy => {
                    if (hit) return;
                    const enemyRect = enemy.getBoundingClientRect();
                    if (fireballTop >= enemyRect.top && fireballTop <= enemyRect.bottom &&
                        fireballLeft >= enemyRect.left && fireballLeft <= enemyRect.right) {
                        enemy.remove();
                        dropItem(enemy);
                        fireball.remove();
                        hit = true;
                    }
                });
            }

            if (!hit) {
                if (fireballTop < 0 || fireballTop > window.innerHeight || fireballLeft < 0 || fireballLeft > window.innerWidth) {
                    fireball.remove();
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
            const delay = i * 100;

            setTimeout(() => {
                let hit = false;

                function moveWave() {
                    if (hit) return;

                    const waveTop = parseInt(wave.style.top);
                    const waveLeft = parseInt(wave.style.left);
                    wave.style.top = `${waveTop + speed * Math.sin(angle)}px`;
                    wave.style.left = `${waveLeft + speed * Math.cos(angle)}px`;

                    document.querySelectorAll('.enemy').forEach(enemy => {
                        if (!hit) {
                            const enemyRect = enemy.getBoundingClientRect();
                            if (waveTop >= enemyRect.top && waveTop <= enemyRect.bottom &&
                                waveLeft >= enemyRect.left && waveLeft <= enemyRect.right) {
                                enemy.remove();
                                dropItem(enemy);
                                hit = true;
                                wave.remove();
                            }
                        }
                    });

                    if (!hit) {
                        document.querySelectorAll('.boss').forEach(boss => {
                            if (!hit) {
                                const bossRect = boss.getBoundingClientRect();
                                if (waveTop >= bossRect.top && waveTop <= bossRect.bottom &&
                                    waveLeft >= bossRect.left && waveLeft <= bossRect.right) {
                                    boss.takeDamage(25);
                                    hit = true;
                                    wave.remove();
                                }
                            }
                        });
                    }

                    if (!hit && (waveTop < 0 || waveTop > window.innerHeight || waveLeft < 0 || waveLeft > window.innerWidth)) {
                        wave.remove();
                        hit = true;
                    } else if (!hit) {
                        requestAnimationFrame(moveWave);
                    }
                }

                moveWave();
            }, delay);
        }
    }

    function iceBlast(event) {
        console.log('Using Ice Blast');
    
        const playerRect = player.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;
    
        const angle = Math.atan2(mouseY - playerCenterY, mouseX - playerCenterX);
    
        // Create the ice blast projectile
        const iceBlast = document.createElement('div');
        iceBlast.className = 'iceBlast';  // You'll need to define CSS for this class
        iceBlast.style.position = 'absolute';
        iceBlast.style.top = `${playerCenterY}px`;
        iceBlast.style.left = `${playerCenterX}px`;
        document.body.appendChild(iceBlast);
    
        const speed = 7;  // Slightly slower than fireball
    
        function moveIceBlast() {
            const iceBlastTop = parseInt(iceBlast.style.top);
            const iceBlastLeft = parseInt(iceBlast.style.left);
            iceBlast.style.top = `${iceBlastTop + speed * Math.sin(angle)}px`;
            iceBlast.style.left = `${iceBlastLeft + speed * Math.cos(angle)}px`;
    
            let hit = false;  // Track whether the ice blast has hit something
    
            // Check for collision with the boss
            document.querySelectorAll('.boss').forEach(boss => {
                if (hit) return;  // Exit if already hit
                const bossRect = boss.getBoundingClientRect();
                if (iceBlastTop >= bossRect.top && iceBlastTop <= bossRect.bottom &&
                    iceBlastLeft >= bossRect.left && iceBlastLeft <= bossRect.right) {
                    boss.takeDamage(20); // Apply damage (adjust as needed)
                    iceBlast.remove();  // Remove the ice blast immediately
                    hit = true;  // Mark as hit to prevent further processing
                }
            });
    
            // Check for collision with enemies
            if (!hit) {  // Only check if it hasn't already hit the boss
                document.querySelectorAll('.enemy').forEach(enemy => {
                    if (hit) return;  // Exit if already hit
                    const enemyRect = enemy.getBoundingClientRect();
                    if (iceBlastTop >= enemyRect.top && iceBlastTop <= enemyRect.bottom &&
                        iceBlastLeft >= enemyRect.left && iceBlastLeft <= enemyRect.right) {
                        enemy.remove();
                        dropItem("enemy");
                        iceBlast.remove();  // Remove the ice blast immediately
                        hit = true;  // Mark as hit to prevent further processing
                    }
                });
            }
    
            if (!hit) {  // Only continue moving if it hasn't hit anything
                if (iceBlastTop < 0 || iceBlastTop > window.innerHeight || iceBlastLeft < 0 || iceBlastLeft > window.innerWidth) {
                    iceBlast.remove();  // Remove ice blast if it leaves the screen
                } else {
                    requestAnimationFrame(moveIceBlast);
                }
            }
        }
    
        requestAnimationFrame(moveIceBlast);
    }
    

    function frostNova(event) {
        console.log('Using Frost Nova');
    
        // Create the Frost Nova effect at the mouse location
        const frostNova = document.createElement('div');
        frostNova.className = 'frostNova';
        frostNova.style.position = 'absolute';
        frostNova.style.top = `${mouseY - 50}px`;  // Adjust to center the effect on the mouse
        frostNova.style.left = `${mouseX - 50}px`;  // Adjust to center the effect on the mouse
        document.body.appendChild(frostNova);
    
        const radius = 100;  // Radius of the Frost Nova effect
        const baseDamage = 5;  // Initial damage
        const rampUpRate = 2;  // Damage increase per interval
        const intervalDuration = 500;  // Interval duration in milliseconds
        const effectDuration = 5000;  // Total duration of the effect in milliseconds
    
        let timeElapsed = 0;
    
        // Function to apply damage to enemies (dummy function for now)
        function applyDamageToEnemies() {
            console.log('Applying damage to enemies...');  // This is a placeholder for your actual damage logic
        }
    
        const damageInterval = setInterval(() => {
            timeElapsed += intervalDuration;
            console.log(`Time elapsed: ${timeElapsed} ms`);  // Log time elapsed to debug
    
            applyDamageToEnemies();
    
            if (timeElapsed >= effectDuration) {
                clearInterval(damageInterval);
                console.log('Clearing Frost Nova');
                frostNova.remove();  // Remove the Frost Nova effect after it expires
            }
        }, intervalDuration);
    }
    

    function chillingAura() {
        console.log('Activating Chilling Aura');
    
        // Check if the chilling aura is already active
        let aura = document.querySelector('.chillingAura');
        if (!aura) {
            // Create the Chilling Aura effect
            aura = document.createElement('div');
            aura.className = 'chillingAura';
            player.appendChild(aura);
        }
    
        // Aura effect lasts for 4 seconds, similar to the thermal shield
        aura.dataset.active = 'true';
    
        setTimeout(() => {
            if (aura) {
                aura.dataset.active = 'false';
                aura.remove();
            }
        }, 6000);
    }
    

    function glacierStrike(event) {
        console.log('Using Glacier Strike');
    
        const playerRect = player.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;
    
        const angle = Math.atan2(mouseY - playerCenterY, mouseX - playerCenterX);
    
        // Create the Glacier Strike projectile
        const glacierStrike = document.createElement('div');
        glacierStrike.className = 'glacierStrike';
        glacierStrike.style.position = 'absolute';
    
        // Adjust initial position to center it at the player's location
        glacierStrike.style.top = `${playerCenterY - 25}px`;  // Center vertically on the player
        glacierStrike.style.left = `${playerCenterX - 75}px`;  // Center horizontally on the player
    
        // Rotate so the longer side faces the direction of travel
        glacierStrike.style.transform = `rotate(${angle}rad)`;
    
        document.body.appendChild(glacierStrike);
    
        const speed = 8;  // Speed of the projectile
        const range = 1000;  // Range of the projectile
    
        let distanceTraveled = 0;
    
        function moveGlacierStrike() {
            const glacierStrikeTop = parseInt(glacierStrike.style.top);
            const glacierStrikeLeft = parseInt(glacierStrike.style.left);
    
            // Move the projectile in the direction of the mouse
            glacierStrike.style.top = `${glacierStrikeTop + speed * Math.sin(angle)}px`;
            glacierStrike.style.left = `${glacierStrikeLeft + speed * Math.cos(angle)}px`;
    
            distanceTraveled += speed;
    
            // Stop the projectile after it has traveled its maximum range or leaves the screen
            if (distanceTraveled >= range || glacierStrikeTop < 0 || glacierStrikeTop > window.innerHeight || glacierStrikeLeft < 0 || glacierStrikeLeft > window.innerWidth) {
                glacierStrike.remove();
            } else {
                requestAnimationFrame(moveGlacierStrike);
            }
        }
    
        requestAnimationFrame(moveGlacierStrike);
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

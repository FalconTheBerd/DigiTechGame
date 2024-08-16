document.addEventListener('DOMContentLoaded', (event) => {

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    let mouseX, mouseY;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Capture the mouse position
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    const player = document.getElementById('player');
    const moveAmount = 5;
    let playerHealth = 100; // Initial health

    const keysPressed = {};

    // Initialize inventory from local storage or create an empty one
    let inventory = JSON.parse(localStorage.getItem('inventory')) || {};

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
        flameBarrage: document.getElementById('cooldown1'),
        fireball: document.getElementById('cooldown2'),
        thermalShield: document.getElementById('cooldown3'),
        flameWave: document.getElementById('cooldown4'),
        iceBlast: document.getElementById('cooldown1'),
        frostNova: document.getElementById('cooldown2'),
        chillingAura: document.getElementById('cooldown3'),
        glacierStrike: document.getElementById('cooldown4')
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
            document.getElementById('ability1-icon').src = characterAbilities[Object.keys(characterAbilities)[0]].icon;
            document.getElementById('ability2-icon').src = characterAbilities[Object.keys(characterAbilities)[1]].icon;
            document.getElementById('ability3-icon').src = characterAbilities[Object.keys(characterAbilities)[2]].icon;
            document.getElementById('ability4-icon').src = characterAbilities[Object.keys(characterAbilities)[3]].icon;
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

        const abilityKeyMap = {
            Ember: {
                'Q': 'flameBarrage',
                'X': 'fireball',
                'C': 'thermalShield',
                'V': 'flameWave'
            },
            Frostbite: {
                'Q': 'iceBlast',
                'X': 'frostNova',
                'C': 'chillingAura',
                'V': 'glacierStrike'
            }
        };

        if (vulgarian && abilityKeyMap[vulgarian]) {
            const abilityName = abilityKeyMap[vulgarian][event.key.toUpperCase()];
            if (abilityName) {
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

        // Normalize diagonal movement
        if (verticalMove !== 0 && horizontalMove !== 0) {
            verticalMove *= Math.sqrt(0.5);
            horizontalMove *= Math.sqrt(0.5);
        }

        top = Math.max(0, Math.min(window.innerHeight - player.clientHeight, top + verticalMove));
        left = Math.max(0, Math.min(window.innerWidth - player.clientWidth, left + horizontalMove));

        player.style.top = `${top}px`;
        player.style.left = `${left}px`;

        const shield = document.querySelector('.thermalShield, .chillingAura');
        if (shield) {
            shield.style.top = `${top + (player.clientHeight / 2) - (shield.clientHeight / 2)}px`;
            shield.style.left = `${left + (player.clientWidth / 2) - (shield.clientWidth / 2)}px`;
        }

        requestAnimationFrame(movePlayer);
    }

    function useAbility(abilityName, event) {
        const vulgarian = localStorage.getItem('vulgarian');
        const characterAbilities = abilities[vulgarian];

        if (!characterAbilities) {
            console.error(`No abilities found for vulgarian: ${vulgarian}`);
            return;
        }

        const ability = characterAbilities[Object.keys(characterAbilities).find(key => key.includes(abilityName.replace('ability', '')))];

        if (!ability) {
            console.error(`Ability "${abilityName}" not found for character "${vulgarian}"`);
            return;
        }

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
            console.error(`Cooldown element for ${abilityName} not found`);
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
    
                // Check for collision with enemies
                document.querySelectorAll('.enemy').forEach(enemy => {
                    if (hit) return;
                    const enemyRect = enemy.getBoundingClientRect();
                    if (flameTop >= enemyRect.top && flameTop <= enemyRect.bottom &&
                        flameLeft >= enemyRect.left && flameLeft <= enemyRect.right) {
                        console.log('Flame Barrage hit an enemy');
                        enemy.remove();
                        dropItem("enemy");
                        hit = true;
                        flame.remove();
                    }
                });
    
                // Check for collision with bosses
                if (!hit) {
                    document.querySelectorAll('.boss').forEach(boss => {
                        if (hit) return;
                        const bossRect = boss.getBoundingClientRect();
                        if (flameTop >= bossRect.top && flameTop <= bossRect.bottom &&
                            flameLeft >= bossRect.left && flameLeft <= bossRect.right) {
                            console.log('Flame Barrage hit a boss');
                            boss.takeDamage(5); // Adjust the damage as needed
                            hit = true;
                            flame.remove();
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
    
            let hit = false;
    
            // Check for collision with enemies
            document.querySelectorAll('.enemy').forEach(enemy => {
                if (hit) return;
                const enemyRect = enemy.getBoundingClientRect();
                if (fireballTop >= enemyRect.top && fireballTop <= enemyRect.bottom &&
                    fireballLeft >= enemyRect.left && fireballLeft <= enemyRect.right) {
                    console.log('Fireball hit an enemy');
                    enemy.remove();
                    dropItem("enemy");
                    hit = true;
                    fireball.remove();
                }
            });
    
            // Check for collision with bosses
            if (!hit) {
                document.querySelectorAll('.boss').forEach(boss => {
                    if (hit) return;
                    const bossRect = boss.getBoundingClientRect();
                    if (fireballTop >= bossRect.top && fireballTop <= bossRect.bottom &&
                        fireballLeft >= bossRect.left && fireballLeft <= bossRect.right) {
                        console.log('Fireball hit a boss');
                        boss.takeDamage(30); // Adjust the damage as needed
                        hit = true;
                        fireball.remove();
                    }
                });
            }
    
            if (!hit && (fireballTop < 0 || fireballTop > window.innerHeight || fireballLeft < 0 || fireballLeft > window.innerWidth)) {
                fireball.remove();
            } else if (!hit) {
                requestAnimationFrame(moveFireball);
            }
        }
    
        requestAnimationFrame(moveFireball);
    }
    
    function thermalShield() {
        let shield = document.querySelector('.thermalShield');
        if (!shield) {
            shield = document.createElement('div');
            shield.className = 'thermalShield';
            document.body.appendChild(shield);
        }
    
        const updateShieldPosition = () => {
            const playerRect = player.getBoundingClientRect();
            const playerCenterX = playerRect.left + playerRect.width / 2;
            const playerCenterY = playerRect.top + playerRect.height / 2;
    
            // Position the shield based on the player's center
            shield.style.position = 'absolute';
            shield.style.top = `${playerCenterY - shield.clientHeight / 2}px`;
            shield.style.left = `${playerCenterX - shield.clientWidth / 2}px`;
        };
    
        // Set the initial position of the shield
        updateShieldPosition();
    
        // Update the shield position as the player moves
        const moveShieldWithPlayer = () => {
            updateShieldPosition();
            if (shield.dataset.active === 'true') {
                requestAnimationFrame(moveShieldWithPlayer);
            }
        };
    
        shield.dataset.active = 'true';
    
        moveShieldWithPlayer();
    
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
                function moveWave() {
                    const waveTop = parseInt(wave.style.top);
                    const waveLeft = parseInt(wave.style.left);
                    wave.style.top = `${waveTop + speed * Math.sin(angle)}px`;
                    wave.style.left = `${waveLeft + speed * Math.cos(angle)}px`;
    
                    let hit = false;
    
                    // Check for collision with enemies
                    document.querySelectorAll('.enemy').forEach(enemy => {
                        if (hit) return;
                        const enemyRect = enemy.getBoundingClientRect();
                        if (waveTop >= enemyRect.top && waveTop <= enemyRect.bottom &&
                            waveLeft >= enemyRect.left && waveLeft <= enemyRect.right) {
                            console.log('Flame Wave hit an enemy');
                            enemy.remove();
                            dropItem("enemy");
                            hit = true;
                            wave.remove();
                        }
                    });
    
                    // Check for collision with bosses
                    if (!hit) {
                        document.querySelectorAll('.boss').forEach(boss => {
                            if (hit) return;
                            const bossRect = boss.getBoundingClientRect();
                            if (waveTop >= bossRect.top && waveTop <= bossRect.bottom &&
                                waveLeft >= bossRect.left && waveLeft <= bossRect.right) {
                                console.log('Flame Wave hit a boss');
                                boss.takeDamage(25); // Adjust the damage as needed
                                hit = true;
                                wave.remove();
                            }
                        });
                    }
    
                    if (!hit && (waveTop < 0 || waveTop > window.innerHeight || waveLeft < 0 || waveLeft > window.innerWidth)) {
                        wave.remove();
                    } else if (!hit) {
                        requestAnimationFrame(moveWave);
                    }
                }
    
                moveWave();
            }, delay);
        }
    }
    

    function iceBlast(event) {
        const playerRect = player.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;

        const angle = Math.atan2(mouseY - playerCenterY, mouseX - playerCenterX);

        const iceBlast = document.createElement('div');
        iceBlast.className = 'iceBlast';
        iceBlast.style.position = 'absolute';
        iceBlast.style.top = `${playerCenterY}px`;
        iceBlast.style.left = `${playerCenterX}px`;
        document.body.appendChild(iceBlast);

        const speed = 8;

        function moveIceBlast() {
            const iceBlastTop = parseInt(iceBlast.style.top);
            const iceBlastLeft = parseInt(iceBlast.style.left);
            iceBlast.style.top = `${iceBlastTop + speed * Math.sin(angle)}px`;
            iceBlast.style.left = `${iceBlastLeft + speed * Math.cos(angle)}px`;

            let hit = false;

            // Check for collision with enemies
            document.querySelectorAll('.enemy').forEach(enemy => {
                if (hit) return;
                const enemyRect = enemy.getBoundingClientRect();
                if (iceBlastTop >= enemyRect.top && iceBlastTop <= enemyRect.bottom &&
                    iceBlastLeft >= enemyRect.left && iceBlastLeft <= enemyRect.right) {
                    console.log(`Ice Blast hit an enemy at (${iceBlastLeft}, ${iceBlastTop})`);
                    enemy.remove();
                    dropItem("enemy");
                    hit = true;
                    iceBlast.remove();
                }
            });

            // Check for collision with bosses
            if (!hit) {
                document.querySelectorAll('.boss').forEach(boss => {
                    if (hit) return;
                    const bossRect = boss.getBoundingClientRect();
                    if (iceBlastTop >= bossRect.top && iceBlastTop <= bossRect.bottom &&
                        iceBlastLeft >= bossRect.left && iceBlastLeft <= bossRect.right) {
                        console.log(`Ice Blast hit the boss at (${iceBlastLeft}, ${iceBlastTop})`);
                        boss.takeDamage(25); // Adjust the damage as needed
                        hit = true;
                        iceBlast.remove();
                    }
                });
            }

            if (!hit && (iceBlastTop < 0 || iceBlastTop > window.innerHeight || iceBlastLeft < 0 || iceBlastLeft > window.innerWidth)) {
                iceBlast.remove();
            } else if (!hit) {
                requestAnimationFrame(moveIceBlast);
            }
        }

        requestAnimationFrame(moveIceBlast);
    }



    function frostNova(event) {
        console.log('Using Frost Nova');

        const frostNova = document.createElement('div');
        frostNova.className = 'frostNova';
        frostNova.style.position = 'absolute';
        frostNova.style.top = `${mouseY - 50}px`;
        frostNova.style.left = `${mouseX - 50}px`;
        document.body.appendChild(frostNova);

        const radius = 100;
        const baseDamage = 5;
        const rampUpRate = 2;
        const intervalDuration = 500;
        const effectDuration = 5000;

        let timeElapsed = 0;

        const damageInterval = setInterval(() => {
            timeElapsed += intervalDuration;

            // Increase damage over time
            const currentDamage = baseDamage + rampUpRate * (timeElapsed / intervalDuration);

            // Apply damage to all enemies in the radius
            document.querySelectorAll('.enemy').forEach(enemy => {
                const enemyRect = enemy.getBoundingClientRect();
                const distance = Math.sqrt(
                    Math.pow(enemyRect.left + enemyRect.width / 2 - mouseX, 2) +
                    Math.pow(enemyRect.top + enemyRect.height / 2 - mouseY, 2)
                );

                if (distance <= radius) {
                    console.log(`Frost Nova hit an enemy at (${enemyRect.left}, ${enemyRect.top})`);
                    enemy.remove();
                    dropItem("enemy");
                }
            });

            // Apply damage to bosses within the radius
            document.querySelectorAll('.boss').forEach(boss => {
                const bossRect = boss.getBoundingClientRect();
                const distance = Math.sqrt(
                    Math.pow(bossRect.left + bossRect.width / 2 - mouseX, 2) +
                    Math.pow(bossRect.top + bossRect.height / 2 - mouseY, 2)
                );

                if (distance <= radius) {
                    console.log(`Frost Nova hit the boss at (${bossRect.left}, ${bossRect.top})`);
                    boss.takeDamage(currentDamage); // Adjust damage calculation as needed
                }
            });

            if (timeElapsed >= effectDuration) {
                clearInterval(damageInterval);
                frostNova.remove();
            }
        }, intervalDuration);
    }


    function chillingAura() {
        let aura = document.querySelector('.chillingAura');
        if (!aura) {
            aura = document.createElement('div');
            aura.className = 'chillingAura';
            document.body.appendChild(aura);
        }

        const updateAuraPosition = () => {
            const playerRect = player.getBoundingClientRect();
            const playerCenterX = playerRect.left + playerRect.width / 2;
            const playerCenterY = playerRect.top + playerRect.height / 2;

            // Position the aura based on the player's center
            aura.style.position = 'absolute';
            aura.style.top = `${playerCenterY - aura.clientHeight / 2}px`;
            aura.style.left = `${playerCenterX - aura.clientWidth / 2}px`;
        };

        // Set the initial position of the aura
        updateAuraPosition();

        // Update the aura position as the player moves
        const moveAuraWithPlayer = () => {
            updateAuraPosition();
            if (aura.dataset.active === 'true') {
                requestAnimationFrame(moveAuraWithPlayer);
            }
        };

        aura.dataset.active = 'true';

        moveAuraWithPlayer();

        setTimeout(() => {
            if (aura) {
                aura.dataset.active = 'false';
                aura.remove();
            }
        }, 4000);
    }




    function glacierStrike(event) {
        const playerRect = player.getBoundingClientRect();
        const playerCenterX = playerRect.left + playerRect.width / 2;
        const playerCenterY = playerRect.top + playerRect.height / 2;

        const angle = Math.atan2(mouseY - playerCenterY, mouseX - playerCenterX);

        const glacierStrike = document.createElement('div');
        glacierStrike.className = 'glacierStrike';
        glacierStrike.style.position = 'absolute';
        glacierStrike.style.top = `${playerCenterY - 25}px`;
        glacierStrike.style.left = `${playerCenterX - 75}px`;
        glacierStrike.style.transform = `rotate(${angle}rad)`;
        document.body.appendChild(glacierStrike);

        const speed = 8;
        const range = 1000;

        let distanceTraveled = 0;

        function moveGlacierStrike() {
            const glacierStrikeTop = parseInt(glacierStrike.style.top);
            const glacierStrikeLeft = parseInt(glacierStrike.style.left);

            glacierStrike.style.top = `${glacierStrikeTop + speed * Math.sin(angle)}px`;
            glacierStrike.style.left = `${glacierStrikeLeft + speed * Math.cos(angle)}px`;

            distanceTraveled += speed;

            let hit = false;

            // Check for collision with enemies
            document.querySelectorAll('.enemy').forEach(enemy => {
                if (hit) return;
                const enemyRect = enemy.getBoundingClientRect();
                if (glacierStrikeTop >= enemyRect.top && glacierStrikeTop <= enemyRect.bottom &&
                    glacierStrikeLeft >= enemyRect.left && glacierStrikeLeft <= enemyRect.right) {
                    console.log(`Glacier Strike hit an enemy at (${glacierStrikeLeft}, ${glacierStrikeTop})`);
                    enemy.remove();
                    dropItem("enemy");
                    hit = true;
                    glacierStrike.remove();
                }
            });

            // Check for collision with bosses
            if (!hit) {
                document.querySelectorAll('.boss').forEach(boss => {
                    if (hit) return;
                    const bossRect = boss.getBoundingClientRect();
                    if (glacierStrikeTop >= bossRect.top && glacierStrikeTop <= bossRect.bottom &&
                        glacierStrikeLeft >= bossRect.left && glacierStrikeLeft <= bossRect.right) {
                        console.log(`Glacier Strike hit the boss at (${glacierStrikeLeft}, ${glacierStrikeTop})`);
                        boss.takeDamage(40); // Adjust the damage as needed
                        hit = true;
                        glacierStrike.remove();
                    }
                });
            }

            if (!hit && (distanceTraveled >= range || glacierStrikeTop < 0 || glacierStrikeTop > window.innerHeight || glacierStrikeLeft < 0 || glacierStrikeLeft > window.innerWidth)) {
                glacierStrike.remove();
            } else if (!hit) {
                requestAnimationFrame(moveGlacierStrike);
            }
        }

        requestAnimationFrame(moveGlacierStrike);
    }



    function createEnemy(type, top, left) {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.top = `${top}px`;
        enemy.style.left = `${left}px`;
        enemy.dataset.type = type; // Store enemy type in dataset for drops
        enemy.style.backgroundImage = 'url("https://lh3.googleusercontent.com/d/16IkZCYSnwFIjSKp51rP7qRFahjtjKQjp")'; // Correct URL format
        enemy.style.backgroundSize = 'cover'; // Ensures the image covers the div
        document.body.appendChild(enemy);

        const speed = 2;
        let directionX = Math.random() < 0.5 ? 1 : -1;
        let directionY = Math.random() < 0.5 ? 1 : -1;

        function moveEnemy() {
            if (!document.body.contains(enemy)) return; // Stop movement if the enemy is removed

            let enemyTop = parseFloat(enemy.style.top);
            let enemyLeft = parseFloat(enemy.style.left);

            // Randomly move the enemy
            enemyTop += directionY * speed; // move up or down
            enemyLeft += directionX * speed; // move left or right

            // Check bounds and change direction if necessary
            if (enemyTop <= 0 || enemyTop >= window.innerHeight - enemy.clientHeight) {
                directionY *= -1;
            }
            if (enemyLeft <= 0 || enemyLeft >= window.innerWidth - enemy.clientWidth) {
                directionX *= -1;
            }

            enemy.style.top = `${enemyTop}px`;
            enemy.style.left = `${enemyLeft}px`;

            requestAnimationFrame(moveEnemy);
        }

        function shootPlayer() {
            if (!document.body.contains(enemy)) return; // Stop shooting if the enemy is removed

            const playerRect = player.getBoundingClientRect();
            const playerCenterX = playerRect.left + playerRect.width / 2;
            const playerCenterY = playerRect.top + playerRect.height / 2;
            const enemyRect = enemy.getBoundingClientRect();
            const enemyCenterX = enemyRect.left + enemyRect.width / 2;
            const enemyCenterY = enemyRect.top + enemyRect.height / 2;

            const angle = Math.atan2(playerCenterY - enemyCenterY, playerCenterX - enemyCenterX);

            const bullet = document.createElement('div');
            bullet.className = 'bullet';
            bullet.style.position = 'absolute';
            bullet.style.top = `${enemyCenterY}px`;
            bullet.style.left = `${enemyCenterX}px`;
            document.body.appendChild(bullet);

            const bulletSpeed = 10;
            const bulletDamage = 5; // Reduced bullet damage

            function moveBullet() {
                let bulletTop = parseFloat(bullet.style.top);
                let bulletLeft = parseFloat(bullet.style.left);

                bulletTop += bulletSpeed * Math.sin(angle);
                bulletLeft += bulletSpeed * Math.cos(angle);

                bullet.style.top = `${bulletTop}px`;
                bullet.style.left = `${bulletLeft}px`;

                // Check for collision with player
                const playerRect = player.getBoundingClientRect();
                if (bulletTop >= playerRect.top && bulletTop <= playerRect.bottom &&
                    bulletLeft >= playerRect.left && bulletLeft <= playerRect.right) {
                    decreasePlayerHealth(bulletDamage);
                    bullet.remove();
                    return;
                }

                if (bulletTop < 0 || bulletTop > window.innerHeight || bulletLeft < 0 || bulletLeft > window.innerWidth) {
                    bullet.remove();
                } else {
                    requestAnimationFrame(moveBullet);
                }
            }

            requestAnimationFrame(moveBullet);
        }

        requestAnimationFrame(moveEnemy);
        setInterval(shootPlayer, 3000); // Enemies shoot every 3 seconds
    }

    function dropItem(enemy) {
        const itemTypes = ['Gold', 'Ice Heart', 'Temperature Stabiliser', 'Exo Suit Part']; // Example item types
        const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        let amount = 1;

        if (enemy === 'enemy') {  // Correct comparison using '==='
            const dropChance = Math.round(Math.random());
            console.log(`Drop chance: ${dropChance}`); // Log the drop chance

            if (dropChance === 1) { // 50/50 chance
                if (randomItem === 'Gold') {
                    amount = Math.floor(Math.random() * 10) + 1;
                }
                inventory[randomItem] = (inventory[randomItem] || 0) + amount;
                console.log(`Dropped ${amount} ${randomItem}. Total: ${inventory[randomItem]}`);
                localStorage.setItem('inventory', JSON.stringify(inventory));
                showItemPopup(randomItem, amount);
            } else {
                console.log('No item dropped.');
            }
        } else {  // Always drop if something other than 'enemy' is passed
            if (randomItem === 'Gold') {
                amount = Math.floor(Math.random() * 10) + 1;
            }
            inventory[randomItem] = (inventory[randomItem] || 0) + amount;
            console.log(`Dropped ${amount} ${randomItem}. Total: ${inventory[randomItem]}`);
            localStorage.setItem('inventory', JSON.stringify(inventory));
            showItemPopup(randomItem, amount);
        }
    }

    function weightedRandom(items, weights) {
        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
        const randomValue = Math.random() * totalWeight;

        let cumulativeWeight = 0;
        for (let i = 0; i < items.length; i++) {
            cumulativeWeight += weights[i];
            if (randomValue < cumulativeWeight) {
                return items[i];
            }
        }
    }

    function showItemPopup(item, amount = 1) {
        // Create or select the popup container
        let popupContainer = document.getElementById('popupContainer');
        if (!popupContainer) {
            popupContainer = document.createElement('div');
            popupContainer.id = 'popupContainer';
            popupContainer.style.position = 'fixed';
            popupContainer.style.bottom = '10px';
            popupContainer.style.right = '10px';
            popupContainer.style.width = '200px';
            popupContainer.style.zIndex = '1000';
            document.body.appendChild(popupContainer);
        }

        // Create a new popup item
        const popup = document.createElement('div');
        popup.className = 'item-popup';
        popup.style.marginBottom = '5px';
        popup.style.backgroundColor = '#333';
        popup.style.color = '#fff';
        popup.style.padding = '10px';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';

        // Set the popup text based on the item
        if (item === 'Gold') {
            popup.textContent = `You got: ${amount} Gold`;
        } else {
            popup.textContent = `You got: ${item}`;
        }

        // Append the popup to the container
        popupContainer.appendChild(popup);

        // Show the popup
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);

        // Hide the popup after 2 seconds
        setTimeout(() => {
            popup.remove();
            // If the container is empty, remove it
            if (popupContainer.childNodes.length === 0) {
                popupContainer.remove();
            }
        }, 2000);
    }

    function spawnWave(enemyCount) {
        for (let i = 0; i < enemyCount; i++) {
            const top = Math.random() * (window.innerHeight - 50);
            const left = Math.random() * (window.innerWidth - 50);
            createEnemy('soldier', top, left);
        }
    }

    function createBoss() {
        const top = Math.random() * (window.innerHeight - 150);
        const left = Math.random() * (window.innerWidth - 150);
        const boss = document.createElement('div');
        boss.className = 'boss';
        boss.style.position = 'absolute';
        boss.style.top = `${top}px`;
        boss.style.left = `${left}px`;
        boss.style.width = '100px'; // Boss size to make it visible
        boss.style.height = '100px';
        boss.style.backgroundImage = 'url("https://lh3.googleusercontent.com/d/1uM2rvMfFQ0v7GnvAqj00M-f9QzxHiK1S")'; // Correct URL format
        boss.style.backgroundSize = 'cover'; // Ensures the image covers the div

        // Create the health bar container and health bar (same as before)
        const healthBarContainer = document.createElement('div');
        const healthBar = document.createElement('div');
        healthBarContainer.className = 'boss-health-bar-container';
        healthBarContainer.style.position = 'absolute';
        healthBarContainer.style.top = '-20px';
        healthBarContainer.style.left = '0';
        healthBarContainer.style.width = '100%';
        healthBarContainer.style.height = '10px';
        healthBarContainer.style.backgroundColor = '#444';
        healthBar.className = 'boss-health-bar';
        healthBar.style.width = '100%';
        healthBar.style.height = '100%';
        healthBar.style.backgroundColor = '#4caf50';
        healthBarContainer.appendChild(healthBar);
        boss.appendChild(healthBarContainer);
        document.body.appendChild(boss);

        boss.health = 200;

        const bossSpeed = 2;

        function moveBoss() {
            if (!document.body.contains(boss)) return;

            let bossTop = parseFloat(boss.style.top);
            let bossLeft = parseFloat(boss.style.left);

            const playerRect = player.getBoundingClientRect();
            const angle = Math.atan2(playerRect.top - bossTop, playerRect.left - bossLeft);

            bossTop += bossSpeed * Math.sin(angle);
            bossLeft += bossSpeed * Math.cos(angle);

            boss.style.top = `${bossTop}px`;
            boss.style.left = `${bossLeft}px`;

            requestAnimationFrame(moveBoss);
        }

        function shootPlayer() {
            if (!document.body.contains(boss)) return;

            const playerRect = player.getBoundingClientRect();
            const bossRect = boss.getBoundingClientRect();
            const angle = Math.atan2(playerRect.top - bossRect.top, playerRect.left - bossRect.left);

            const bullet = document.createElement('div');
            bullet.className = 'bullet';
            bullet.style.position = 'absolute';
            bullet.style.top = `${bossRect.top + bossRect.height / 2}px`;
            bullet.style.left = `${bossRect.left + bossRect.width / 2}px`;
            bullet.style.width = '10px';
            bullet.style.height = '10px';
            bullet.style.backgroundColor = 'yellow';
            bullet.style.borderRadius = '50%';
            document.body.appendChild(bullet);

            const bulletSpeed = 15;
            const bulletDamage = 20;

            function moveBullet() {
                if (!document.body.contains(bullet)) return;  // Stop movement if the bullet is removed

                let bulletTop = parseFloat(bullet.style.top);
                let bulletLeft = parseFloat(bullet.style.left);

                bulletTop += bulletSpeed * Math.sin(angle);
                bulletLeft += bulletSpeed * Math.cos(angle);

                bullet.style.top = `${bulletTop}px`;
                bullet.style.left = `${bulletLeft}px`;

                // Check for collision with player
                const playerRect = player.getBoundingClientRect();
                if (bulletTop >= playerRect.top && bulletTop <= playerRect.bottom &&
                    bulletLeft >= playerRect.left && bulletLeft <= playerRect.right) {
                    decreasePlayerHealth(bulletDamage);
                    bullet.remove();  // Remove bullet immediately after it hits the player
                    return;
                }

                // Remove bullet if it leaves the screen
                if (bulletTop < 0 || bulletTop > window.innerHeight || bulletLeft < 0 || bulletLeft > window.innerWidth) {
                    bullet.remove();
                } else {
                    requestAnimationFrame(moveBullet);
                }
            }

            requestAnimationFrame(moveBullet);
        }

        boss.takeDamage = function (damage) {
            boss.health -= damage;

            if (boss.health <= 0) {
                boss.remove();
                dropItem("boss");
                dropItem("boss");
                dropItem("boss");

                const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const redirectPath = isLocal ? 'game.html' : '/DigiTechGame/game.html';

                sleep(5000).then(() => {
                    window.location.href = redirectPath;
                });

            } else {
                const healthPercentage = (boss.health / 200) * 100;
                healthBar.style.width = `${healthPercentage}%`;
                healthBar.style.backgroundColor = healthPercentage > 60 ? '#4caf50' :
                    healthPercentage > 30 ? '#ffeb3b' :
                        '#f44336';
                console.log(`boss took ${damage} damage, health is now ${boss.health}`);
            }
        };


        moveBoss();
        setInterval(shootPlayer, 1000);  // Boss shoots every 1 second
    }

    function startGame() {
        let wave = 1;
        let bossCreated = false; // Track if the boss has been created

        function nextWave() {
            if (wave <= 2) {
                const enemyCount = wave; // Adjust the number of enemies for each wave
                spawnWave(enemyCount); // Spawn the correct number of enemies
                wave++;
            } else if (wave === 3 && !bossCreated) {
                createBoss(); // Spawn the boss after two waves
                bossCreated = true; // Mark the boss as created
            }
        }

        // Start the first wave
        nextWave();

        // Move to next wave or boss after the current wave is cleared
        const waveCheckInterval = setInterval(() => {
            const enemiesLeft = document.querySelectorAll('.enemy').length;
            const bossExists = document.querySelectorAll('.boss').length > 0;

            if (enemiesLeft === 0 && !bossExists) {
                if (wave <= 3) {
                    nextWave();
                } else {
                    clearInterval(waveCheckInterval); // Stop checking after the boss wave
                }
            }
        }, 1000); // Check every second if the wave is cleared
    }

    // Function to update the health bar
    function updateHealthBar() {
        const healthBar = document.getElementById('health-bar');
        healthBar.style.width = `${playerHealth}%`;

        if (playerHealth > 60) {
            healthBar.style.backgroundColor = '#4caf50'; // Green
        } else if (playerHealth > 30) {
            healthBar.style.backgroundColor = '#ffeb3b'; // Yellow
        } else {
            healthBar.style.backgroundColor = '#f44336'; // Red
        }
    }

    // Example function to decrease player health
    function decreasePlayerHealth(amount) {
        playerHealth = Math.max(0, playerHealth - amount);
        updateHealthBar();
        console.log(`Player health decreased by ${amount}, current health: ${playerHealth}`);
        if (playerHealth === 0) {
            alert('Game Over');
            if (isLocal) {
                window.location.href = `game.html`;
            } else {
                window.location.href = `/DigiTechGame/game.html`;
            }
        }
    }

    // Start the animation loop
    requestAnimationFrame(movePlayer);

    // Update the health bar initially
    updateHealthBar();

    // Start the game with waves and boss
    startGame();
});

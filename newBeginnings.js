document.addEventListener('DOMContentLoaded', (event) => {
    let mouseX, mouseY;

    // Capture the mouse position
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    const player = document.getElementById('player');
    const moveAmount = 5;
    let playerHealth = 100; // Initial health

    const keysPressed = {};

    const abilities = {
        Ember: {
            flameBarrage: {
                icon: 'placeholder.png',
                cooldown: 5000,
                lastUsed: 0,
                action: function (event) {
                    flameBarrage(event);
                }
            },
            fireball: {
                icon: 'placeholder.png',
                cooldown: 3000,
                lastUsed: 0,
                action: function (event) {
                    fireball(event);
                }
            },
            thermalShield: {
                icon: 'placeholder.png',
                cooldown: 15000,
                lastUsed: 0,
                action: function () {
                    thermalShield();
                }
            },
            flameWave: {
                icon: 'placeholder.png',
                cooldown: 10000,
                lastUsed: 0,
                action: function (event) {
                    flameWave(event);
                }
            }
        },
        // Add other characters and their abilities here
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

        if (event.key.toUpperCase() === 'Q') {
            if (vulgarian) {
                useAbility('flameBarrage', event);
            }
        } else if (event.key.toUpperCase() === 'X') {
            if (vulgarian) {
                useAbility('fireball', event);
            }
        } else if (event.key.toUpperCase() === 'C') {
            if (vulgarian) {
                useAbility('thermalShield', event);
            }
        } else if (event.key.toUpperCase() === 'V') {
            if (vulgarian) {
                useAbility('flameWave', event);
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

        // Normalize diagonal movement
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
        const characterAbilities = abilities[vulgarian];
        if (!characterAbilities) return;

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
                document.querySelectorAll('.enemy').forEach(enemy => {
                    const enemyRect = enemy.getBoundingClientRect();
                    if (flameTop >= enemyRect.top && flameTop <= enemyRect.bottom &&
                        flameLeft >= enemyRect.left && flameLeft <= enemyRect.right) {
                        enemy.remove();
                        flame.remove();
                    }
                });

                if (flameTop < 0 || flameTop > window.innerHeight || flameLeft < 0 || flameLeft > window.innerWidth) {
                    flame.remove();
                } else {
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
        fireball.style.top = `${playerCenterY}px`;
        fireball.style.left = `${playerCenterX}px`;
        document.body.appendChild(fireball);

        const speed = 10;

        function moveFireball() {
            const fireballTop = parseInt(fireball.style.top);
            const fireballLeft = parseInt(fireball.style.left);
            fireball.style.top = `${fireballTop + speed * Math.sin(angle)}px`;
            fireball.style.left = `${fireballLeft + speed * Math.cos(angle)}px`;

            // Check for collision with enemies
            document.querySelectorAll('.enemy').forEach(enemy => {
                const enemyRect = enemy.getBoundingClientRect();
                if (fireballTop >= enemyRect.top && fireballTop <= enemyRect.bottom &&
                    fireballLeft >= enemyRect.left && fireballLeft <= enemyRect.right) {
                    enemy.remove();
                    fireball.remove();
                }
            });

            if (fireballTop < 0 || fireballTop > window.innerHeight || fireballLeft < 0 || fireballLeft > window.innerWidth) {
                fireball.remove();
            } else {
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
            const delay = i * 100; // delay each wave

            setTimeout(() => {
                function moveWave() {
                    const waveTop = parseInt(wave.style.top);
                    const waveLeft = parseInt(wave.style.left);
                    wave.style.top = `${waveTop + speed * Math.sin(angle)}px`;
                    wave.style.left = `${waveLeft + speed * Math.cos(angle)}px`;

                    // Check for collision with enemies
                    document.querySelectorAll('.enemy').forEach(enemy => {
                        const enemyRect = enemy.getBoundingClientRect();
                        if (waveTop >= enemyRect.top && waveTop <= enemyRect.bottom &&
                            waveLeft >= enemyRect.left && waveLeft <= enemyRect.right) {
                            enemy.remove();
                            wave.remove();
                        }
                    });

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

    function createEnemy(type, top, left) {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        enemy.style.top = `${top}px`;
        enemy.style.left = `${left}px`;
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

            const bulletSpeed = 5;
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
                    decreasePlayerHealth(10);
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

    function spawnWave(enemyCount) {
        for (let i = 0; i < enemyCount; i++) {
            const top = Math.random() * (window.innerHeight - 50);
            const left = Math.random() * (window.innerWidth - 50);
            createEnemy('soldier', top, left);
        }
    }

    // Spawn initial wave
    spawnWave(10);

    // Spawn additional waves every 30 seconds
    setInterval(() => {
        spawnWave(10);
    }, 30000);

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
            // Add logic to handle game over scenario
        }
    }

    // Start the animation loop
    requestAnimationFrame(movePlayer);

    // Update the health bar initially
    updateHealthBar();
});

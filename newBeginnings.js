document.addEventListener('DOMContentLoaded', (event) => {

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '10.0.0.51';

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


    // Setting the vulgarian and ability icons
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

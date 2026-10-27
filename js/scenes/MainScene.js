// Main Game Scene
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        // Create world
        this.createWorld();

        // Create player
        this.createPlayer();

        // Create other players
        this.otherPlayers = this.physics.add.group();

        // Create enemies
        this.enemies = this.physics.add.group();

        // Setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Setup camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        // Combat setup
        this.isAttacking = false;
        this.attackCooldown = 500;
        this.lastAttackTime = 0;

        // Spawn initial enemies
        this.spawnEnemies(20);

        // Update loop
        this.events.on('update', this.update, this);
    }

    createWorld() {
        // Create tilemap
        const mapWidth = CONFIG.WORLD_WIDTH / CONFIG.TILE_SIZE;
        const mapHeight = CONFIG.WORLD_HEIGHT / CONFIG.TILE_SIZE;

        // Create ground tiles
        this.ground = this.add.tileSprite(
            CONFIG.WORLD_WIDTH / 2,
            CONFIG.WORLD_HEIGHT / 2,
            CONFIG.WORLD_WIDTH,
            CONFIG.WORLD_HEIGHT,
            null
        );
        this.ground.setFillStyle(0x228B22); // Forest green

        // Add biome regions
        this.createBiomes();

        // Add boundaries
        this.physics.world.setBounds(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    }

    createBiomes() {
        const biomes = CONFIG.BIOMES;
        const regions = [
            { x: 2000, y: 2000, width: 1500, height: 1500, biome: 'desert' },
            { x: 5000, y: 3000, width: 2000, height: 2000, biome: 'snow' },
            { x: 3000, y: 6000, width: 1800, height: 1800, biome: 'jungle' },
            { x: 7000, y: 5000, width: 1500, height: 1500, biome: 'mountains' },
            { x: 4000, y: 4000, width: 2000, height: 2000, biome: 'plains' },
            { x: 6000, y: 2000, width: 1500, height: 1500, biome: 'swamp' }
        ];

        regions.forEach(region => {
            const rect = this.add.rectangle(
                region.x + region.width / 2,
                region.y + region.height / 2,
                region.width,
                region.height,
                biomes[region.biome].color
            );
            rect.setAlpha(0.5);
        });

        // Safe zone (starter village)
        const safeZone = this.add.rectangle(500, 500, 800, 800, 0x4169E1);
        safeZone.setAlpha(0.3);
        this.add.text(500, 500, 'Safe Zone', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    createPlayer() {
        // Load character position
        const startX = GameState.character?.x || 500;
        const startY = GameState.character?.y || 500;

        // Create player sprite
        this.player = this.physics.add.sprite(startX, startY, null);
        this.player.setTint(0xe94560);
        this.player.setSize(32, 32);

        // Player name
        this.playerName = this.add.text(startX, startY - 20, GameState.character?.name || 'Player', {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Movement speed
        this.moveSpeed = 200;

        // Player stats
        this.playerDamage = 10;
        this.playerDefense = 0;
    }

    update() {
        if (!this.player) return;

        // Handle movement
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            velocityX = -this.moveSpeed;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            velocityX = this.moveSpeed;
        }

        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            velocityY = -this.moveSpeed;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            velocityY = this.moveSpeed;
        }

        this.player.setVelocity(velocityX, velocityY);

        // Update player name position
        this.playerName.setPosition(this.player.x, this.player.y - 20);

        // Handle attack
        if (this.spaceKey.isDown && !this.isAttacking) {
            this.attack();
        }

        // Check biome
        this.checkBiome();

        // Update character position
        if (GameState.character) {
            GameState.character.x = this.player.x;
            GameState.character.y = this.player.y;

            // Emit position update
            if (GameState.socket) {
                GameState.socket.emit('player_move', {
                    characterId: GameState.character.id,
                    x: this.player.x,
                    y: this.player.y
                });
            }
        }

        // Update other players
        this.updateOtherPlayers();

        // Update enemies
        this.updateEnemies();
    }

    checkBiome() {
        const x = this.player.x;
        const y = this.player.y;

        let currentBiome = 'forest';

        // Simple biome detection based on position
        if (x < 1500 && y < 1500) {
            currentBiome = 'forest'; // Safe zone area
        } else if (x > 2000 && x < 3500 && y > 2000 && y < 3500) {
            currentBiome = 'desert';
        } else if (x > 5000 && x < 7000 && y > 3000 && y < 5000) {
            currentBiome = 'snow';
        } else if (x > 3000 && x < 4800 && y > 6000 && y < 7800) {
            currentBiome = 'jungle';
        } else if (x > 7000 && x < 8500 && y > 5000 && y < 6500) {
            currentBiome = 'mountains';
        } else if (x > 4000 && x < 6000 && y > 4000 && y < 6000) {
            currentBiome = 'plains';
        } else if (x > 6000 && x < 7500 && y > 2000 && y < 3500) {
            currentBiome = 'swamp';
        }

        GameState.character.biome = currentBiome;
        document.getElementById('current-biome').textContent = CONFIG.BIOMES[currentBiome].name;
        document.getElementById('current-position').textContent = `${Math.floor(x)}, ${Math.floor(y)}`;
    }

    updateOtherPlayers() {
        GameState.otherPlayers.forEach((data, characterId) => {
            let otherPlayer = this.otherPlayers.get(characterId);

            if (!otherPlayer) {
                otherPlayer = this.physics.add.sprite(data.x, data.y, null);
                otherPlayer.setTint(0x4e9eff);
                otherPlayer.setSize(32, 32);
                this.otherPlayers.add(otherPlayer);

                const name = this.add.text(data.x, data.y - 20, data.name, {
                    fontSize: '14px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                otherPlayer.nameText = name;
            } else {
                otherPlayer.setPosition(data.x, data.y);
                otherPlayer.nameText.setPosition(data.x, data.y - 20);
            }
        });
    }

    attack() {
        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;

        this.isAttacking = true;
        this.lastAttackTime = now;

        // Create attack visual
        const attackRange = 60;
        const attackCircle = this.add.circle(this.player.x, this.player.y, attackRange, 0xe94560, 0.5);
        this.tweens.add({
            targets: attackCircle,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                attackCircle.destroy();
                this.isAttacking = false;
            }
        });

        // Check for enemy hits
        this.enemies.getChildren().forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (distance < attackRange) {
                this.damageEnemy(enemy, this.playerDamage);
            }
        });

        // Check for PvP hits (outside safe zone)
        if (GameState.character.level > CONFIG.NOOB_PROTECTION_LEVEL) {
            const x = this.player.x;
            const y = this.player.y;
            const inSafeZone = x < 1500 && y < 1500;

            if (!inSafeZone) {
                this.otherPlayers.getChildren().forEach(otherPlayer => {
                    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, otherPlayer.x, otherPlayer.y);
                    if (distance < attackRange) {
                        this.damagePlayer(otherPlayer, this.playerDamage);
                    }
                });
            }
        }
    }

    damageEnemy(enemy, damage) {
        enemy.hp -= damage;
        enemy.setTint(0xff0000);
        this.time.delayedCall(100, () => enemy.setTint(0xff9900));

        if (enemy.hp <= 0) {
            // Enemy defeated
            this.destroyEnemy(enemy);
        }
    }

    destroyEnemy(enemy) {
        // Give XP and money
        const xpReward = 50;
        const moneyReward = 10;

        GameState.character.experience += xpReward;
        GameState.character.money += moneyReward;

        // Chance to drop item
        if (Math.random() < 0.3) {
            const droppedItem = this.getRandomDrop();
            if (droppedItem) {
                addItemToInventory(droppedItem);
                showNotification(`Looted: ${droppedItem.name}`);
            }
        }

        showNotification(`Enemy defeated! +${xpReward} XP, +$${moneyReward}`);
        updateHUD();

        // Respawn enemy after delay
        this.time.delayedCall(10000, () => {
            this.spawnEnemy();
        });

        enemy.destroy();
    }

    getRandomDrop() {
        const drops = [
            { id: 'health-potion', name: 'Health Potion', description: 'Restores 50 HP', rarity: 'common', type: 'consumable', base_value: 20, quantity: 1, stackable: true },
            { id: 'wood', name: 'Wood', description: 'Basic building material', rarity: 'common', type: 'material', base_value: 5, quantity: 5, stackable: true },
            { id: 'iron-sword', name: 'Iron Sword', description: 'A sturdy iron sword', rarity: 'uncommon', type: 'weapon', base_value: 50, damage: 15, defense: 0, quantity: 1, stackable: false }
        ];

        const rarityChance = Math.random();
        if (rarityChance < 0.7) return drops[0]; // 70% common
        if (rarityChance < 0.9) return drops[1]; // 20% uncommon
        return drops[2]; // 10% rare
    }

    damagePlayer(otherPlayer, damage) {
        // Emit PvP damage event to server
        if (GameState.socket) {
            GameState.socket.emit('pvp_attack', {
                targetCharacterId: otherPlayer.characterId,
                damage: damage
            });
        }
    }

    takeDamage(damage) {
        // Apply noob protection
        if (GameState.character.level <= CONFIG.NOOB_PROTECTION_LEVEL) {
            showNotification('Noob protection active!');
            return;
        }

        // Apply defense
        const actualDamage = Math.max(1, damage - this.playerDefense);
        GameState.character.hp -= actualDamage;

        showNotification(`Took ${actualDamage} damage!`);
        updateHUD();

        // Check for death
        if (GameState.character.hp <= 0) {
            this.handleDeath();
        }
    }

    handleDeath() {
        // Call the global handleDeath function from game.js
        if (typeof handleDeath === 'function') {
            handleDeath();
        }
    }

    spawnEnemies(count) {
        for (let i = 0; i < count; i++) {
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(500, CONFIG.WORLD_WIDTH - 500);
        const y = Phaser.Math.Between(500, CONFIG.WORLD_HEIGHT - 500);

        // Don't spawn in safe zone
        if (x < 1500 && y < 1500) {
            return this.spawnEnemy();
        }

        const enemy = this.physics.add.sprite(x, y, null);
        enemy.setTint(0xff9900);
        enemy.setSize(32, 32);
        enemy.hp = 50;
        enemy.maxHp = 50;
        enemy.damage = 10;
        enemy.speed = 50;

        // Enemy name
        enemy.nameText = this.add.text(x, y - 20, 'Enemy', {
            fontSize: '12px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.enemies.add(enemy);
    }

    updateEnemies() {
        this.enemies.getChildren().forEach(enemy => {
            // Simple AI: move towards player if close
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);

            if (distance < 300) {
                // Move towards player
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                enemy.setVelocity(Math.cos(angle) * enemy.speed, Math.sin(angle) * enemy.speed);

                // Attack if close
                if (distance < 40) {
                    this.time.delayedCall(1000, () => {
                        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) < 40) {
                            this.takeDamage(enemy.damage);
                        }
                    });
                }
            } else {
                // Wander randomly
                if (Math.random() < 0.02) {
                    const randomAngle = Math.random() * Math.PI * 2;
                    enemy.setVelocity(Math.cos(randomAngle) * enemy.speed * 0.5, Math.sin(randomAngle) * enemy.speed * 0.5);
                }
            }

            // Update name position
            enemy.nameText.setPosition(enemy.x, enemy.y - 20);
        });
    }
}

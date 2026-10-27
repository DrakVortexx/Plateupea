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

        // Create other players group
        this.otherPlayers = this.add.group();

        // Create enemies group
        this.enemies = this.physics.add.group();

        // Create projectiles group
        this.projectiles = this.physics.add.group();

        // Create loot drops group
        this.lootDrops = this.physics.add.group();

        // Setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,A,S,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // Setup camera with smooth follow
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.2);
        this.cameras.main.setLerp(0.1, 0.1);

        // Combat setup
        this.isAttacking = false;
        this.attackCooldown = CONFIG.ATTACK_COOLDOWN;
        this.lastAttackTime = 0;
        this.comboCount = 0;
        this.comboTimer = null;

        // Particle effects
        this.particles = this.add.particles('particle');

        // Spawn initial enemies
        this.spawnEnemies(50);

        // Spawn loot periodically
        this.time.addEvent({
            delay: 30000,
            callback: this.spawnLoot,
            callbackScope: this,
            loop: true
        });

        // Update loop
        this.events.on('update', this.update, this);
    }

    createWorld() {
        // Create ground with gradient
        this.ground = this.add.graphics();
        this.ground.fillGradientStyle(0x1e4d2b, 0x1e4d2b, 0x0f2f1a, 0x0f2f1a, 1);
        this.ground.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
        
        // Add grid pattern for better visuals
        this.ground.lineStyle(1, 0x2a5a3a, 0.25);
        for (let x = 0; x < CONFIG.WORLD_WIDTH; x += 64) {
            this.ground.moveTo(x, 0);
            this.ground.lineTo(x, CONFIG.WORLD_HEIGHT);
        }
        for (let y = 0; y < CONFIG.WORLD_HEIGHT; y += 64) {
            this.ground.moveTo(0, y);
            this.ground.lineTo(CONFIG.WORLD_WIDTH, y);
        }
        this.ground.strokePath();

        // Add decorative elements
        this.addDecorations();

        // Add biome regions
        this.createBiomes();

        // Add boundaries
        this.physics.world.setBounds(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    }

    addDecorations() {
        // Add rocks and trees for visual
        for (let i = 0; i < 400; i++) {
            const x = Phaser.Math.Between(0, CONFIG.WORLD_WIDTH);
            const y = Phaser.Math.Between(0, CONFIG.WORLD_HEIGHT);
            // Avoid safe zone
            if (x > 2000 && x < 3000 && y > 2000 && y < 3000) continue;
            
            const type = Math.random() < 0.65 ? 'tree' : 'rock';
            if (type === 'tree') {
                // Tree trunk
                const trunk = this.add.rectangle(x, y + 6, 4, 12, 0x4a3728);
                trunk.setDepth(1);
                // Tree leaves
                const leaves = this.add.circle(x, y - 2, 12, 0x1a5f1a);
                leaves.setAlpha(0.9);
                leaves.setDepth(2);
            } else {
                const rock = this.add.circle(x, y, 6, 0x555555);
                rock.setAlpha(0.8);
                rock.setDepth(1);
                // Add some smaller rocks
                if (Math.random() < 0.3) {
                    const rock2 = this.add.circle(x + 8, y + 4, 4, 0x666666);
                    rock2.setAlpha(0.7);
                    rock2.setDepth(1);
                }
            }
        }
        
        // Add some grass patches
        for (let i = 0; i < 200; i++) {
            const x = Phaser.Math.Between(0, CONFIG.WORLD_WIDTH);
            const y = Phaser.Math.Between(0, CONFIG.WORLD_HEIGHT);
            if (x > 2000 && x < 3000 && y > 2000 && y < 3000) continue;
            const grass = this.add.circle(x, y, 2, 0x2d6b2d);
            grass.setAlpha(0.4);
            grass.setDepth(0);
        }
    }

    createBiomes() {
        const biomes = CONFIG.BIOMES;
        const regions = [
            { x: 3000, y: 3000, width: 2000, height: 2000, biome: 'desert' },
            { x: 8000, y: 4000, width: 2500, height: 2500, biome: 'snow' },
            { x: 4000, y: 9000, width: 2200, height: 2200, biome: 'jungle' },
            { x: 12000, y: 7000, width: 2000, height: 2000, biome: 'mountains' },
            { x: 6000, y: 6000, width: 3000, height: 3000, biome: 'plains' },
            { x: 10000, y: 3000, width: 2000, height: 2000, biome: 'swamp' },
            { x: 15000, y: 10000, width: 2500, height: 2500, biome: 'volcanic' },
            { x: 5000, y: 14000, width: 3000, height: 3000, biome: 'corrupted' }
        ];

        regions.forEach(region => {
            const rect = this.add.rectangle(
                region.x + region.width / 2,
                region.y + region.height / 2,
                region.width,
                region.height,
                biomes[region.biome].color
            );
            rect.setAlpha(0.4);
            rect.setDepth(-1);
        });

        // Safe zone (starter village)
        const safeZone = this.add.rectangle(2500, 2500, 1200, 1200, 0x4169E1);
        safeZone.setAlpha(0.25);
        safeZone.setDepth(-1);
        
        const safeText = this.add.text(2500, 2500, 'SPAWN VILLAGE\n[SAFE ZONE]', {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(10);
        
        // Add decorative buildings
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const bx = 2500 + Math.cos(angle) * 400;
            const by = 2500 + Math.sin(angle) * 400;
            const building = this.add.rectangle(bx, by, 60, 60, 0x8b7355);
            building.setAlpha(0.8);
        }
    }

    createPlayer() {
        // Load character position
        const startX = GameState.character?.x || 2500;
        const startY = GameState.character?.y || 2500;

        // Create player with better graphics - drawn shape
        this.player = this.physics.add.sprite(startX, startY, null);
        this.player.setDisplaySize(32, 32);
        this.player.setDepth(6);
        
        // Draw player as a circle with outline
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x00d4ff, 1);
        playerGraphics.fillCircle(0, 0, 14);
        playerGraphics.lineStyle(3, 0xffffff, 1);
        playerGraphics.strokeCircle(0, 0, 14);
        playerGraphics.lineStyle(2, 0x0099ff, 1);
        playerGraphics.beginPath();
        playerGraphics.moveTo(0, -14);
        playerGraphics.lineTo(0, -18);
        playerGraphics.strokePath();
        playerGraphics.generateTexture('playerTex', 40, 40);
        playerGraphics.destroy();
        
        this.player.setTexture('playerTex');
        this.player.body.setCircle(14);

        // Add player glow
        this.playerGlow = this.add.circle(startX, startY, 18, 0x00d4ff, 0.25);
        this.playerGlow.setDepth(4);
        
        this.tweens.add({
            targets: this.playerGlow,
            scaleX: 1.4,
            scaleY: 1.4,
            alpha: 0.05,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        // Player name with better styling
        const displayName = GameState.character?.name || GameState.player?.username || 'Player';
        this.playerName = this.add.text(startX, startY - 40, displayName, {
            fontSize: '16px',
            color: '#00d4ff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, fill: true }
        }).setOrigin(0.5).setDepth(12);

        // Movement speed
        this.moveSpeed = CONFIG.WALK_SPEED || 180;
        this.sprinting = false;

        // Player stats
        this.playerDamage = 18 + (GameState.character?.level || 1) * 3;
        this.playerDefense = (GameState.character?.level || 1) * 2;
        this.playerMaxHp = CONFIG.START_HP || 150 + (GameState.character?.level || 1) * 12;
        this.playerHp = GameState.character?.hp || this.playerMaxHp;
    }

    update() {
        if (!this.player) return;

        // Handle sprinting
        this.sprinting = this.shiftKey && this.shiftKey.isDown;
        const walkSpeed = CONFIG.WALK_SPEED || 180;
        const sprintSpeed = CONFIG.SPRINT_SPEED || 280;
        const currentSpeed = this.sprinting ? sprintSpeed : walkSpeed;
        
        // Handle movement
        let velocityX = 0;
        let velocityY = 0;

        if (this.cursors && (this.cursors.left.isDown || (this.wasd && this.wasd.A && this.wasd.A.isDown))) {
            velocityX = -currentSpeed;
        } else if (this.cursors && (this.cursors.right.isDown || (this.wasd && this.wasd.D && this.wasd.D.isDown))) {
            velocityX = currentSpeed;
        }

        if (this.cursors && (this.cursors.up.isDown || (this.wasd && this.wasd.W && this.wasd.W.isDown))) {
            velocityY = -currentSpeed;
        } else if (this.cursors && (this.cursors.down.isDown || (this.wasd && this.wasd.S && this.wasd.S.isDown))) {
            velocityY = currentSpeed;
        }

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }

        this.player.setVelocity(velocityX, velocityY);
        
        // Update player glow position
        if (this.playerGlow) {
            this.playerGlow.setPosition(this.player.x, this.player.y);
        }

        // Update player name position
        if (this.playerName) {
            this.playerName.setPosition(this.player.x, this.player.y - 40);
        }

        // Handle attack
        if (this.spaceKey && this.spaceKey.isDown && !this.isAttacking) {
            this.attack();
        }

        // Check biome
        this.checkBiome();

        // Update character position
        if (GameState.character) {
            GameState.character.x = this.player.x;
            GameState.character.y = this.player.y;

            // Emit position update
            if (GameState.socket && GameState.socket.emit) {
                GameState.socket.emit('player_move', {
                    characterId: GameState.character.id,
                    x: this.player.x,
                    y: this.player.y,
                    sprinting: this.sprinting
                });
            }
        }

        // Update other players
        this.updateOtherPlayers();

        // Update enemies
        this.updateEnemies();

        // Update loot
        this.updateLoot();
    }

    checkBiome() {
        if (!GameState.character) return;
        const x = this.player.x;
        const y = this.player.y;

        let currentBiome = 'forest';

        // Biome detection based on position
        if (x > 2000 && x < 3000 && y > 2000 && y < 3000) {
            currentBiome = 'forest'; // Safe zone area
        } else if (x > 3000 && x < 5000 && y > 3000 && y < 5000) {
            currentBiome = 'desert';
        } else if (x > 8000 && x < 10500 && y > 4000 && y < 6500) {
            currentBiome = 'snow';
        } else if (x > 4000 && x < 6200 && y > 9000 && y < 11200) {
            currentBiome = 'jungle';
        } else if (x > 12000 && x < 14000 && y > 7000 && y < 9000) {
            currentBiome = 'mountains';
        } else if (x > 6000 && x < 9000 && y > 6000 && y < 9000) {
            currentBiome = 'plains';
        } else if (x > 10000 && x < 12000 && y > 3000 && y < 5000) {
            currentBiome = 'swamp';
        } else if (x > 15000 && x < 17500 && y > 10000 && y < 12500) {
            currentBiome = 'volcanic';
        } else if (x > 5000 && x < 8000 && y > 14000 && y < 17000) {
            currentBiome = 'corrupted';
        }

        if (GameState.character.biome !== currentBiome) {
            GameState.character.biome = currentBiome;
            if (typeof showNotification === 'function') {
                showNotification(`Entering ${CONFIG.BIOMES && CONFIG.BIOMES[currentBiome] ? CONFIG.BIOMES[currentBiome].name : currentBiome}`);
            }
        }
        const biomeEl = document.getElementById('current-biome');
        if (biomeEl) biomeEl.textContent = CONFIG.BIOMES && CONFIG.BIOMES[currentBiome] ? CONFIG.BIOMES[currentBiome].name : currentBiome;
        const posEl = document.getElementById('current-position');
        if (posEl) posEl.textContent = `${Math.floor(x)}, ${Math.floor(y)}`;
    }

    updateOtherPlayers() {
        if (!GameState.otherPlayers) return;
        
        GameState.otherPlayers.forEach((data, characterId) => {
            if (characterId === GameState.character?.id) return;
            
            let otherPlayer = this.otherPlayers.getChildren().find(p => p.characterId === characterId);

            if (!otherPlayer) {
                otherPlayer = this.physics.add.sprite(data.x || 0, data.y || 0, null);
                otherPlayer.setTint(0xff4757);
                otherPlayer.setSize(28, 28);
                otherPlayer.setDepth(5);
                otherPlayer.characterId = characterId;
                this.otherPlayers.add(otherPlayer);

                otherPlayer.glow = this.add.circle(data.x, data.y, 16, 0xff4757, 0.2);
                otherPlayer.glow.setDepth(4);
                
                const name = this.add.text(data.x, data.y - 35, data.name || 'Player', {
                    fontSize: '14px',
                    color: '#ff4757',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 2
                }).setOrigin(0.5).setDepth(10);
                otherPlayer.nameText = name;
                otherPlayer.levelText = this.add.text(data.x, data.y + 25, `Lv.${data.level || 1}`, {
                    fontSize: '11px',
                    color: '#ffd700',
                    stroke: '#000000',
                    strokeThickness: 2
                }).setOrigin(0.5).setDepth(10);
            } else {
                otherPlayer.setPosition(data.x || 0, data.y || 0);
                if (otherPlayer.glow) otherPlayer.glow.setPosition(data.x, data.y);
                if (otherPlayer.nameText) otherPlayer.nameText.setPosition(data.x, data.y - 35);
                if (otherPlayer.levelText) otherPlayer.levelText.setPosition(data.x, data.y + 25);
            }
        });
    }

    attack() {
        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;

        this.isAttacking = true;
        this.lastAttackTime = now;
        this.comboCount++;

        // Reset combo after delay
        if (this.comboTimer) this.comboTimer.remove();
        this.comboTimer = this.time.delayedCall(1200, () => {
            this.comboCount = 0;
        });

        // Create attack visual
        const attackRange = CONFIG.ATTACK_RANGE;
        const comboMultiplier = 1 + (this.comboCount - 1) * 0.2;
        const attackDamage = Math.floor(this.playerDamage * comboMultiplier);
        
        // Attack slash effect
        const angle = Math.atan2(this.input.mousePointer.y - this.cameras.main.height/2, this.input.mousePointer.x - this.cameras.main.width/2);
        const slash = this.add.graphics();
        slash.lineStyle(4, 0x00d4ff, 1);
        slash.beginPath();
        slash.arc(this.player.x, this.player.y, attackRange, angle - Math.PI/4, angle + Math.PI/4, false);
        slash.strokePath();
        
        this.tweens.add({
            targets: slash,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 250,
            onComplete: () => {
                slash.destroy();
                this.isAttacking = false;
            }
        });

        // Check for enemy hits
        this.enemies.getChildren().forEach(enemy => {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (distance < attackRange + 10) {
                // Check if in front arc
                const enemyAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(enemyAngle - angle));
                if (angleDiff < Math.PI/3 || this.comboCount > 2) {
                    this.damageEnemy(enemy, attackDamage);
                }
            }
        });

        // Check for PvP hits (outside safe zone)
        const level = GameState.character?.level || 1;
        if (level > CONFIG.NOOB_PROTECTION_LEVEL) {
            const x = this.player.x;
            const y = this.player.y;
            const inSafeZone = x > 2000 && x < 3000 && y > 2000 && y < 3000;

            if (!inSafeZone) {
                this.otherPlayers.getChildren().forEach(otherPlayer => {
                    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, otherPlayer.x, otherPlayer.y);
                    if (distance < attackRange + 10) {
                        const enemyAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, otherPlayer.x, otherPlayer.y);
                        const angleDiff = Math.abs(Phaser.Math.Angle.Wrap(enemyAngle - angle));
                        if (angleDiff < Math.PI/3) {
                            this.damagePlayer(otherPlayer, attackDamage);
                        }
                    }
                });
            } else {
                showNotification('PvP disabled in safe zone');
            }
        }
    }

    damageEnemy(enemy, damage) {
        // Critical hit
        const isCrit = Math.random() < CONFIG.CRIT_CHANCE;
        const finalDamage = isCrit ? Math.floor(damage * CONFIG.CRIT_MULTIPLIER) : damage;
        
        enemy.hp -= finalDamage;
        enemy.setTint(0xff0000);
        
        // Damage number
        const dmgText = this.add.text(enemy.x, enemy.y - 10, isCrit ? `-${finalDamage} CRIT!` : `-${finalDamage}`, {
            fontSize: isCrit ? '16px' : '14px',
            color: isCrit ? '#ffd700' : '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: dmgText,
            y: enemy.y - 40,
            alpha: 0,
            duration: 800,
            onComplete: () => dmgText.destroy()
        });
        
        this.time.delayedCall(100, () => {
            if (enemy.active) enemy.setTint(enemy.originalTint || 0xff6b6b);
        });

        if (enemy.hp <= 0) {
            // Enemy defeated
            this.destroyEnemy(enemy);
        }
    }

    destroyEnemy(enemy) {
        if (!GameState.character) return;
        
        // Give XP and money based on enemy level
        const enemyLevel = enemy.level || 1;
        const xpReward = Math.floor(75 * enemyLevel * (1 + Math.random() * 0.3));
        const moneyReward = Math.floor(15 * enemyLevel * (1 + Math.random() * 0.5));

        GameState.character.experience = (GameState.character.experience || 0) + xpReward;
        GameState.character.money = (GameState.character.money || 0) + moneyReward;

        // Check level up
        this.checkLevelUp();

        // Chance to drop item
        const dropChance = 0.4 * CONFIG.BIOMES[GameState.character.biome]?.lootBonus || 1;
        if (Math.random() < dropChance) {
            const droppedItem = this.getRandomDrop(enemyLevel);
            if (droppedItem) {
                this.spawnLootDrop(enemy.x, enemy.y, droppedItem);
            }
        }

        showNotification(`+${xpReward} XP | +$${moneyReward}`);
        updateHUD();

        // Respawn enemy after delay
        this.time.delayedCall(8000, () => {
            this.spawnEnemy();
        });

        if (enemy.nameText) enemy.nameText.destroy();
        if (enemy.hpBar) enemy.hpBar.destroy();
        if (enemy.hpBarBg) enemy.hpBarBg.destroy();
        enemy.destroy();
    }

    getRandomDrop(level = 1) {
        const rarityRoll = Math.random();
        let rarity = 'common';
        
        for (const [r, data] of Object.entries(CONFIG.RARITIES)) {
            if (rarityRoll < data.chance) {
                rarity = r;
                break;
            }
        }
        
        const itemPool = {
            common: [
                { id: 'health-potion', name: 'Health Potion', description: 'Restores 60 HP', rarity: 'common', type: 'consumable', base_value: 25, heal: 60, quantity: 1, stackable: true },
                { id: 'wood', name: 'Wood', description: 'Building material', rarity: 'common', type: 'material', base_value: 8, quantity: Math.floor(Math.random()*5)+3, stackable: true },
                { id: 'stone', name: 'Stone', description: 'Building material', rarity: 'common', type: 'material', base_value: 10, quantity: Math.floor(Math.random()*4)+2, stackable: true }
            ],
            uncommon: [
                { id: 'iron-sword', name: 'Iron Sword', description: 'Sturdy blade', rarity: 'uncommon', type: 'weapon', base_value: 80, damage: 18 + level, defense: 0, quantity: 1, stackable: false },
                { id: 'leather-armor', name: 'Leather Armor', description: 'Light protection', rarity: 'uncommon', type: 'armor', base_value: 70, damage: 0, defense: 12, quantity: 1, stackable: false }
            ],
            rare: [
                { id: 'steel-sword', name: 'Steel Sword', description: 'Sharp steel blade', rarity: 'rare', type: 'weapon', base_value: 250, damage: 28 + level*2, defense: 0, quantity: 1, stackable: false },
                { id: 'chainmail', name: 'Chainmail Armor', description: 'Reinforced armor', rarity: 'rare', type: 'armor', base_value: 200, damage: 0, defense: 22, quantity: 1, stackable: false }
            ],
            epic: [
                { id: 'crystal-blade', name: 'Crystal Blade', description: 'Mystic power flows through', rarity: 'epic', type: 'weapon', base_value: 800, damage: 45 + level*3, defense: 0, quantity: 1, stackable: false }
            ]
        };
        
        const pool = itemPool[rarity] || itemPool.common;
        const item = {...pool[Math.floor(Math.random() * pool.length)]};
        item.rarityData = CONFIG.RARITIES[rarity];
        return item;
    }

    spawnLootDrop(x, y, item) {
        const drop = this.physics.add.sprite(x, y, null);
        drop.setTint(parseInt(CONFIG.RARITIES[item.rarity].color.replace('#', '0x')));
        drop.setSize(16, 16);
        drop.item = item;
        drop.setDepth(3);
        
        // Float animation
        this.tweens.add({
            targets: drop,
            y: y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Glow
        drop.glow = this.add.circle(x, y, 12, parseInt(CONFIG.RARITIES[item.rarity].color.replace('#', '0x')), 0.3);
        drop.glow.setDepth(2);
        
        this.lootDrops.add(drop);
        
        // Auto-despawn after 60 seconds
        this.time.delayedCall(60000, () => {
            if (drop.active) {
                if (drop.glow) drop.glow.destroy();
                drop.destroy();
            }
        });
    }

    updateLoot() {
        this.lootDrops.getChildren().forEach(drop => {
            if (drop.glow) drop.glow.setPosition(drop.x, drop.y);
            
            // Check pickup range
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, drop.x, drop.y);
            if (dist < 50) {
                // Auto pickup
                if (typeof addItemToInventory === 'function') {
                    addItemToInventory(drop.item);
                }
                showNotification(`Picked up: ${drop.item.name}`);
                if (drop.glow) drop.glow.destroy();
                drop.destroy();
            }
        });
    }

    spawnLoot() {
        // Spawn random loot in world
        const x = Phaser.Math.Between(1000, CONFIG.WORLD_WIDTH - 1000);
        const y = Phaser.Math.Between(1000, CONFIG.WORLD_HEIGHT - 1000);
        if (x < 2000 && y < 2000) return;
        
        const item = this.getRandomDrop(3);
        this.spawnLootDrop(x, y, item);
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
        const x = Phaser.Math.Between(1000, CONFIG.WORLD_WIDTH - 1000);
        const y = Phaser.Math.Between(1000, CONFIG.WORLD_HEIGHT - 1000);

        // Don't spawn in safe zone
        if (x > 2000 && x < 3000 && y > 2000 && y < 3000) {
            return this.spawnEnemy();
        }

        // Determine enemy level based on distance from spawn
        const distFromSpawn = Math.sqrt((x-2500)**2 + (y-2500)**2);
        const level = Math.max(1, Math.floor(distFromSpawn / 2000) + 1 + Math.floor(Math.random() * 3));
        
        const enemy = this.physics.add.sprite(x, y, null);
        enemy.setTint(0xff4757);
        enemy.setSize(32, 32);
        enemy.setDepth(5);
        enemy.originalTint = 0xff4757;
        enemy.level = level;
        enemy.hp = 60 + level * 25;
        enemy.maxHp = enemy.hp;
        enemy.damage = 12 + level * 4;
        enemy.speed = 60 + level * 5;
        enemy.lastAttack = 0;

        // Enemy name
        enemy.nameText = this.add.text(x, y - 35, `Lv.${level} Rogue`, {
            fontSize: '13px',
            color: '#ff4757',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(10);

        // HP Bar
        enemy.hpBarBg = this.add.rectangle(x, y - 25, 40, 4, 0x000000);
        enemy.hpBarBg.setAlpha(0.7).setDepth(9);
        enemy.hpBar = this.add.rectangle(x - 20, y - 25, 40, 4, 0xff4757);
        enemy.hpBar.setOrigin(0, 0.5).setDepth(10);

        this.enemies.add(enemy);
    }

    updateEnemies() {
        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active) return;
            
            // Update name and HP bar positions
            if (enemy.nameText) enemy.nameText.setPosition(enemy.x, enemy.y - 35);
            if (enemy.hpBarBg) {
                enemy.hpBarBg.setPosition(enemy.x, enemy.y - 25);
                const hpPercent = enemy.hp / enemy.maxHp;
                if (enemy.hpBar) {
                    enemy.hpBar.width = 40 * hpPercent;
                    enemy.hpBar.setPosition(enemy.x - 20, enemy.y - 25);
                    enemy.hpBar.setFillStyle(hpPercent > 0.3 ? 0xff4757 : 0xff0000);
                }
            }

            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);

            if (distance < 400) {
                // Aggressive AI - chase player
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                enemy.setVelocity(Math.cos(angle) * enemy.speed, Math.sin(angle) * enemy.speed);

                // Attack if in range
                const now = Date.now();
                if (distance < 50 && now - enemy.lastAttack > 1500) {
                    enemy.lastAttack = now;
                    this.enemyAttack(enemy);
                }
            } else if (distance < 800) {
                // Cautious - move slower towards
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                enemy.setVelocity(Math.cos(angle) * enemy.speed * 0.6, Math.sin(angle) * enemy.speed * 0.6);
            } else {
                // Wander
                if (Math.random() < 0.01) {
                    const randomAngle = Math.random() * Math.PI * 2;
                    enemy.setVelocity(Math.cos(randomAngle) * enemy.speed * 0.3, Math.sin(randomAngle) * enemy.speed * 0.3);
                }
            }
        });
    }

    enemyAttack(enemy) {
        // Enemy attack visual
        const attackCircle = this.add.circle(enemy.x, enemy.y, 35, 0xff4757, 0.4);
        this.tweens.add({
            targets: attackCircle,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            onComplete: () => attackCircle.destroy()
        });
        
        const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
        if (dist < 60) {
            this.takeDamage(enemy.damage);
        }
    }

    checkLevelUp() {
        if (!GameState.character) return;
        const xpNeeded = this.getXPForLevel(GameState.character.level);
        if ((GameState.character.experience || 0) >= xpNeeded) {
            GameState.character.level++;
            GameState.character.experience -= xpNeeded;
            GameState.character.skillPoints = (GameState.character.skillPoints || 0) + CONFIG.SKILL_POINTS_PER_LEVEL;
            this.playerDamage += 3;
            this.playerDefense += 2;
            this.playerMaxHp += 15;
            this.playerHp = this.playerMaxHp;
            GameState.character.hp = this.playerHp;
            GameState.character.max_hp = this.playerMaxHp;
            
            showNotification(`LEVEL UP! Level ${GameState.character.level}`);
            updateHUD();
        }
    }

    getXPForLevel(level) {
        return Math.floor(100 * Math.pow(1.4, level));
    }
}

// Quest System
let currentQuestTab = 'daily';

function loadQuests() {
    // Setup tab buttons
    document.querySelectorAll('.quest-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.quest-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentQuestTab = btn.dataset.tab;
            loadQuestContent();
        });
    });

    loadQuestContent();
}

function loadQuestContent() {
    const list = document.getElementById('quest-list');
    list.innerHTML = '';

    // Mock quests based on tab
    const quests = getQuestsByType(currentQuestTab);

    quests.forEach(quest => {
        const questItem = document.createElement('div');
        questItem.className = 'quest-item';

        const isCompleted = GameState.currentQuests.some(q => q.id === quest.id && q.status === 'completed');
        const isInProgress = GameState.currentQuests.some(q => q.id === quest.id && q.status === 'in_progress');

        if (isCompleted) {
            questItem.classList.add('completed');
        } else if (isInProgress) {
            questItem.classList.add('active');
        }

        questItem.innerHTML = `
            <div class="quest-title">${quest.title}</div>
            <div class="quest-description">${quest.description}</div>
            <div class="quest-rewards">
                Rewards: $${quest.reward_money} | ${quest.reward_experience} XP
            </div>
            ${!isCompleted && !isInProgress ? `<button onclick="acceptQuest(${quest.id})">Accept</button>` : ''}
            ${isInProgress ? `<button onclick="completeQuest(${quest.id})">Complete</button>` : ''}
        `;

        list.appendChild(questItem);
    });
}

function getQuestsByType(type) {
    const allQuests = [
        { id: 1, title: 'Chop Wood', description: 'Chop 10 wood using your axe', type: 'daily', reward_money: 50, reward_experience: 100 },
        { id: 2, title: 'Defeat Enemies', description: 'Defeat 5 enemies', type: 'daily', reward_money: 100, reward_experience: 200 },
        { id: 3, title: 'Explore', description: 'Visit 3 different biomes', type: 'weekly', reward_money: 500, reward_experience: 1000 },
        { id: 4, title: 'Craft Item', description: 'Craft your first item', type: 'story', reward_money: 200, reward_experience: 500 }
    ];

    return allQuests.filter(q => q.type === type);
}

function acceptQuest(questId) {
    const quest = getQuestsByType(currentQuestTab).find(q => q.id === questId);
    if (quest) {
        GameState.currentQuests.push({
            id: quest.id,
            status: 'in_progress',
            progress: 0
        });
        showNotification(`Accepted quest: ${quest.title}`);
        loadQuestContent();
    }
}

function completeQuest(questId) {
    const questIndex = GameState.currentQuests.findIndex(q => q.id === questId);
    if (questIndex !== -1) {
        const quest = getQuestsByType(currentQuestTab).find(q => q.id === questId);

        // Give rewards
        GameState.character.money += quest.reward_money;
        GameState.character.experience += quest.reward_experience;

        // Check for level up
        checkLevelUp();

        GameState.currentQuests[questIndex].status = 'completed';
        showNotification(`Completed quest: ${quest.title}`);
        updateHUD();
        loadQuestContent();
    }
}

function checkLevelUp() {
    const xpForLevel = getXPForLevel(GameState.character.level);
    if (GameState.character.experience >= xpForLevel && GameState.character.level < CONFIG.MAX_LEVEL) {
        GameState.character.level++;
        GameState.character.experience -= xpForLevel;
        GameState.character.max_hp += 10;
        GameState.character.hp = GameState.character.max_hp;
        showNotification(`Level up! You are now level ${GameState.character.level}`);
        updateHUD();
    }
}

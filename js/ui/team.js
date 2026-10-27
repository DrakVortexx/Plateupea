// Team System
function loadTeam() {
    const content = document.getElementById('team-content');

    if (GameState.team) {
        // Show team info
        content.innerHTML = `
            <div class="team-info">
                <h3>${GameState.team.name}</h3>
                <p>Leader: ${GameState.team.leader}</p>
                <p>Score: ${GameState.team.score}</p>
                <p>Members: ${GameState.team.memberCount}/20</p>
            </div>
            <div class="team-members">
                ${GameState.team.members.map(member => `
                    <div class="team-member">
                        <span>${member.name}</span>
                        <span>Level ${member.level}</span>
                    </div>
                `).join('')}
            </div>
            <button onclick="leaveTeam()">Leave Team</button>
        `;
    } else {
        // Show create/join interface
        content.innerHTML = `
            <div class="team-creation">
                <h3>Create Team</h3>
                <input type="text" id="team-name" placeholder="Team Name" maxlength="50">
                <button onclick="createTeam()">Create Team</button>
            </div>
            <div class="team-join">
                <h3>Join Team</h3>
                <input type="text" id="team-code" placeholder="Team Code/Name">
                <button onclick="joinTeam()">Join Team</button>
            </div>
        `;
    }
}

function createTeam() {
    const teamName = document.getElementById('team-name').value;
    if (!teamName) {
        showNotification('Please enter a team name');
        return;
    }

    // Mock team creation
    GameState.team = {
        id: Date.now(),
        name: teamName,
        leader: GameState.character.name,
        score: 0,
        memberCount: 1,
        members: [
            { name: GameState.character.name, level: GameState.character.level }
        ]
    };

    showNotification(`Team "${teamName}" created!`);
    loadTeam();
}

function joinTeam() {
    const teamCode = document.getElementById('team-code').value;
    if (!teamCode) {
        showNotification('Please enter a team code');
        return;
    }

    // Mock team join
    showNotification('Team not found (mock)');
}

function leaveTeam() {
    GameState.team = null;
    showNotification('You left the team');
    loadTeam();
}

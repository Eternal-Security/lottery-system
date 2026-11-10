async function loadNumbers() {
    try {
        const response = await fetch('/api/numbers');
        const numbers = await response.json();
        
        const grid = document.getElementById('numbersGrid');
        grid.innerHTML = '';
        
        numbers.forEach(num => {
            const box = document.createElement('div');
            box.className = `number-box ${num.reserved ? 'reserved' : 'available'}`;
            box.textContent = num.number;
            
            if (num.reserved && num.participant_name) {
                box.title = `Reserved by: ${num.participant_name}`;
            }
            
            grid.appendChild(box);
        });
    } catch (error) {
        console.error('Error loading numbers:', error);
    }
}

function refreshNumbers() {
    loadNumbers();
}

// Auto-refresh every 5 seconds
setInterval(loadNumbers, 5000);

// Initial load
loadNumbers();

let currentNumber = null;

async function loadNumbers() {
    try {
        const response = await fetch('/api/numbers');
        const numbers = await response.json();
        
        // Update grid
        const grid = document.getElementById('numbersGrid');
        grid.innerHTML = '';
        
        numbers.forEach(num => {
            const box = document.createElement('div');
            box.className = `number-box ${num.reserved ? 'reserved' : 'available'}`;
            box.textContent = num.number;
            box.onclick = () => openModal(num);
            
            if (num.reserved && num.participant_name) {
                box.title = `Reserved by: ${num.participant_name}`;
            }
            
            grid.appendChild(box);
        });
        
        // Update reserved list
        const reservedList = document.getElementById('reservedList');
        const reserved = numbers.filter(n => n.reserved);
        
        if (reserved.length === 0) {
            reservedList.innerHTML = '<p class="no-reservations">No reservations yet</p>';
        } else {
            reservedList.innerHTML = reserved.map(num => `
                <div class="list-item">
                    <div class="list-number">${num.number}</div>
                    <div class="list-participant">${num.participant_name || 'No name'}</div>
                    <button class="list-unreserve" onclick="quickUnreserve(${num.number})">✕</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading numbers:', error);
    }
}

function openModal(number) {
    currentNumber = number;
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalAction = document.getElementById('modalAction');
    
    if (number.reserved) {
        modalTitle.textContent = `Unreserve Number ${number.number}`;
        modalBody.innerHTML = `
            <p>This number is currently reserved${number.participant_name ? ` by ${number.participant_name}` : ''}.</p>
            <p>Do you want to unreserve it?</p>
        `;
        modalAction.textContent = 'Unreserve';
        modalAction.onclick = unreserveNumber;
    } else {
        modalTitle.textContent = `Reserve Number ${number.number}`;
        modalBody.innerHTML = `
            <label for="participantName">Participant Name (optional):</label>
            <input type="text" id="participantName" placeholder="Enter participant name">
        `;
        modalAction.textContent = 'Reserve';
        modalAction.onclick = reserveNumber;
    }
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    currentNumber = null;
}

async function reserveNumber() {
    const participantName = document.getElementById('participantName').value.trim();
    
    try {
        const response = await fetch('/api/admin/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                number: currentNumber.number,
                participantName: participantName || null
            })
        });
        
        const result = await response.json();
        if (result.success) {
            closeModal();
            loadNumbers();
        }
    } catch (error) {
        console.error('Error reserving number:', error);
        alert('Failed to reserve number');
    }
}

async function unreserveNumber() {
    try {
        const response = await fetch('/api/admin/unreserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number: currentNumber.number })
        });
        
        const result = await response.json();
        if (result.success) {
            closeModal();
            loadNumbers();
        }
    } catch (error) {
        console.error('Error unreserving number:', error);
        alert('Failed to unreserve number');
    }
}

function refreshNumbers() {
    loadNumbers();
}

// Auto-refresh every 5 seconds
setInterval(loadNumbers, 5000);

// Initial load
loadNumbers();

async function quickUnreserve(number) {
    if (!confirm(`Unreserve number ${number}?`)) return;
    
    try {
        const response = await fetch('/api/admin/unreserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ number })
        });
        
        const result = await response.json();
        if (result.success) {
            loadNumbers();
        }
    } catch (error) {
        console.error('Error unreserving number:', error);
        alert('Failed to unreserve number');
    }
}

// Close modal when clicking outside
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});

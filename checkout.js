document.addEventListener('DOMContentLoaded', function() {
    const checkoutHistoryBody = document.getElementById('checkoutHistoryBody');
    const dateFilter = document.getElementById('dateFilter');
    const nameFilter = document.getElementById('nameFilter');

    // Function checkout history
    function renderCheckoutHistory(history) {
        checkoutHistoryBody.innerHTML = '';

        // If no history, show a message
        if (!history || history.length === 0) {
            const noHistoryRow = document.createElement('tr');
            noHistoryRow.innerHTML = `
                <td colspan="7" class="no-history">
                    No checkout history found.
                </td>
            `;
            checkoutHistoryBody.appendChild(noHistoryRow);
            return;
        }


        history.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.date}</td>
                <td>${entry.timeIn}</td>
                <td>${entry.timeOut}</td>
                <td>${entry.pax}</td>
                <td>${entry.contact}</td>
                <td>${entry.tableNumber}</td>
            `;
            checkoutHistoryBody.appendChild(row);
        });
    }

    //checkout history localStorage
    function loadCheckoutHistory() {
        const checkoutHistory = JSON.parse(localStorage.getItem('checkoutHistory')) || [];
        return checkoutHistory;
    }

    // Clear checkout history function
    window.clearCheckoutHistory = function() {

        const confirmClear = confirm('Are you sure you want to clear ALL checkout history? This action cannot be undone.');
        
        if (confirmClear) {
            localStorage.removeItem('checkoutHistory');
            checkoutHistory = [];
            renderCheckoutHistory(checkoutHistory);
            dateFilter.value = '';
            nameFilter.value = '';
            alert('Checkout history has been cleared.');
        }
    };

    // Checkout history Print Function
    window.printCheckoutHistory = function() {
        const dateFilter = document.getElementById('dateFilter').value;
        let checkoutHistory = loadCheckoutHistory();

        if (dateFilter) {
            checkoutHistory = checkoutHistory.filter(entry => entry.date === dateFilter);
        }

        if (!checkoutHistory || checkoutHistory.length === 0) {
            alert('No checkout history to print.');
            return;
        }

        //text content file
        let fileContent = "Checkout History\n\n";
        fileContent += "Name\tDate\tTime In\tTime Out\tGuests\tContact\tTable Number\n";
        fileContent += "--------------------------------------------------------------------\n";

        checkoutHistory.forEach(entry => {
            fileContent += `${entry.name}\t${entry.date}\t${entry.timeIn}\t${entry.timeOut}\t${entry.pax}\t${entry.contact}\t${entry.tableNumber}\n`;
        });

        const blob = new Blob([fileContent], { type: 'text/plain' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `checkout_history_${new Date().toISOString().split('T')[0]}.txt`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    let checkoutHistory = loadCheckoutHistory();
    renderCheckoutHistory(checkoutHistory);

    dateFilter.addEventListener('change', function() {
        const filteredHistory = checkoutHistory.filter(entry => 
            !this.value || entry.date === this.value
        );
        renderCheckoutHistory(filteredHistory);
    });

    nameFilter.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredHistory = checkoutHistory.filter(entry => 
            entry.name.toLowerCase().includes(searchTerm)
        );
        renderCheckoutHistory(filteredHistory);
    });

    window.resetFilters = function() {
        dateFilter.value = '';
        nameFilter.value = '';
        renderCheckoutHistory(checkoutHistory);
    };
});
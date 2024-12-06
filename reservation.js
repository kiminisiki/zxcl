document.addEventListener('DOMContentLoaded', () => {
    const formSection = document.querySelector('.form-section');
    const addReservationBtn = document.querySelector('.add-reservation-btn');
    const editReservationBtn = document.querySelector('.edit-reservation-btn');
    const checkoutReservationBtn = document.querySelector('.checkout-reservation-btn');
    const saveBtn = document.querySelector('.add-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const reservationTableBody = document.getElementById('reservationTableBody');
    const currentDateElement = document.getElementById('current-date');
    const cashierGrid = document.getElementById('cashierGrid');

    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    let isEditing = false;
    let globalEditIndex = null;
    let selectedTable = null;

    // Display Selected Date
    const displaySelectedDate = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedDate = urlParams.get('date') || localStorage.getItem('lastSelectedReservationDate') || new Date().toISOString().split('T')[0];
        localStorage.setItem('lastSelectedReservationDate', selectedDate);
        currentDateElement.textContent = new Date(selectedDate).toDateString();
    };

    const renderReservations = () => {
        reservationTableBody.innerHTML = '';
        const selectedDate = localStorage.getItem('lastSelectedReservationDate');
        const filteredReservations = reservations.filter(reservation => reservation.reservationDate === selectedDate);

        filteredReservations.forEach((reservation) => {
            const originalIndex = reservations.indexOf(reservation);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.name}</td>
                <td>${reservation.timeSlot}</td>
                <td>${reservation.pax}</td>
                <td>${reservation.contactNumber}</td>
                <td>${reservation.tableNumber || 'N/A'}</td>
            `;
            row.addEventListener('click', () => {
                document.querySelectorAll('tr').forEach(tr => tr.classList.remove('selected'));
                row.classList.add('selected');
                globalEditIndex = originalIndex;
                selectedTable = reservation.tableNumber;
            });
            reservationTableBody.appendChild(row);
        });
    };

    // Time Overlap Check
    const isTimeOverlap = (existingSlot, newSlot) => {
        const [start1, end1] = existingSlot.split('-').map(time => parseInt(time.trim()));
        const [start2, end2] = newSlot.split('-').map(time => parseInt(time.trim()));
        return !(end1 <= start2 || end2 <= start1);
    };

    const renderTableGrid = () => {
        cashierGrid.innerHTML = '';
        const selectedDate = localStorage.getItem('lastSelectedReservationDate');
        const newTimeSlot = document.getElementById('timeSlot').value;
        const filteredReservations = reservations.filter(reservation =>
            reservation.reservationDate === selectedDate &&
            isTimeOverlap(reservation.timeSlot, newTimeSlot)
        );

        for (let i = 1; i <= 10; i++) {
            const table = document.createElement('div');
            table.classList.add('cashier-table');
            table.textContent = `Table ${i}`;
            table.dataset.tableNumber = `Table ${i}`;

            const isTableOccupied = filteredReservations.some(reservation => reservation.tableNumber === `Table ${i}`);
            if (isTableOccupied) table.classList.add('cashier-unavailable');

            if (selectedTable === table.textContent) {
                table.classList.add('cashier-selected');
            }

            table.addEventListener('click', () => {
                if (table.classList.contains('cashier-unavailable')) {
                    alert('This table is already reserved for the selected time slot!');
                    return;
                }
                document.querySelectorAll('.cashier-table').forEach(t => t.classList.remove('cashier-selected'));
                table.classList.add('cashier-selected');
                selectedTable = `Table ${i}`;
            });

            cashierGrid.appendChild(table);
        }
    };

    // Add/Edit/Cancel Reservation Event Listeners
    addReservationBtn.addEventListener('click', () => {
        formSection.style.display = 'flex';
        document.querySelectorAll('input').forEach(input => input.value = '');
        document.getElementById('timeSlot').value = '';
        selectedTable = null;
        isEditing = false;
        renderTableGrid();
    });

    // Save Reservation
    const saveReservation = () => {
        const name = document.getElementById('customerName').value;
        const timeSlot = document.getElementById('timeSlot').value;
        const pax = document.getElementById('pax').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const selectedDate = localStorage.getItem('lastSelectedReservationDate');

        if (!name || !timeSlot || !pax || !contactNumber || (!selectedTable && !isEditing)) {
            alert('All fields, table selection, and date are required!');
            return;
        }

        if (!selectedTable && isEditing && globalEditIndex !== null) {
            selectedTable = reservations[globalEditIndex].tableNumber;
        }

        const reservationData = { name, timeSlot, pax, contactNumber, tableNumber: selectedTable, reservationDate: selectedDate };
        if (isEditing && globalEditIndex !== null) {
            reservations[globalEditIndex] = reservationData;
        } else {
            reservations.push(reservationData);
        }

        localStorage.setItem('reservations', JSON.stringify(reservations));
        cancelForm();
        renderReservations();
        renderTableGrid();
    };

    // Cancel Form
    const cancelForm = () => {
        formSection.style.display = 'none';
        isEditing = false;
        globalEditIndex = null;
        selectedTable = null;
        document.querySelectorAll('.cashier-table').forEach(t => t.classList.remove('cashier-selected'));

        document.querySelectorAll('input').forEach(input => input.value = '');
        document.getElementById('timeSlot').value = '';
    };

    //Edit Reservation
    editReservationBtn.addEventListener('click', () => {
        if (globalEditIndex === null) {
            alert('Please select a reservation to edit.');
            return;
        }

        const reservation = reservations[globalEditIndex];
        document.getElementById('customerName').value = reservation.name;
        document.getElementById('timeSlot').value = reservation.timeSlot;
        document.getElementById('pax').value = reservation.pax;
        document.getElementById('contactNumber').value = reservation.contactNumber;

        selectedTable = reservation.tableNumber;
        const tableDiv = Array.from(cashierGrid.children).find(table => table.textContent === selectedTable);
        if (tableDiv) {
            tableDiv.classList.add('cashier-selected');
        }

        formSection.style.display = 'flex';
        isEditing = true;
        renderTableGrid();
    });

    // Cancel Reservation
    const cancelReservationBtn = document.querySelector('.cancel-reservation-btn');
    cancelReservationBtn.addEventListener('click', () => {
        if (globalEditIndex === null) {
            alert('Please select a reservation to cancel.');
            return;
        }

        if (confirm('Are you sure you want to cancel this reservation?')) {
            reservations.splice(globalEditIndex, 1);
            localStorage.setItem('reservations', JSON.stringify(reservations));
            globalEditIndex = null;
            renderReservations();
            renderTableGrid();
        }
    });

    // Checkout Reservation
    checkoutReservationBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to check out this reservation?')) {
            const reservation = reservations[globalEditIndex];
            const timeOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const checkoutHistory = JSON.parse(localStorage.getItem('checkoutHistory')) || [];
            checkoutHistory.push({
                name: reservation.name,
                date: reservation.reservationDate,
                timeIn: reservation.timeSlot.split('-')[0].trim(),
                timeOut: timeOut,
                pax: reservation.pax,
                contact: reservation.contactNumber,
                tableNumber: reservation.tableNumber
            });
    
            localStorage.setItem('checkoutHistory', JSON.stringify(checkoutHistory));
            reservations.splice(globalEditIndex, 1);
            localStorage.setItem('reservations', JSON.stringify(reservations));
            renderReservations();
            renderTableGrid();
        }
    });

    saveBtn.addEventListener('click', saveReservation);
    cancelBtn.addEventListener('click', cancelForm);
    document.getElementById('timeSlot').addEventListener('change', renderTableGrid);

    displaySelectedDate();
    renderReservations();
    renderTableGrid();
});


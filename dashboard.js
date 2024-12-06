// Navigation function
const homeLink = document.getElementById('home-link');
const reservationLink = document.getElementById('reservation-link');
const contactsLink = document.getElementById('contacts-link');
const homeSection = document.getElementById('home-section');
const reservationSection = document.getElementById('reservation-section');
const contactsSection = document.getElementById('contacts-section');

function hideAllSections() {
    homeSection.style.display = 'none';
    reservationSection.style.display = 'none';
    contactsSection.style.display = 'none';
}

function showSection(sectionId) {
    hideAllSections();

    if (sectionId === 'home') {
        homeSection.style.display = 'block';
    } else if (sectionId === 'reservation') {
        reservationSection.style.display = 'block';
        const calendarContainer = document.getElementById("calendar");

        if (!calendarContainer.innerHTML) {
            createCalendar(currentYear, currentMonth);
            generateMonthDropdown();
        }
    } else if (sectionId === 'contacts') {
        contactsSection.style.display = 'block';
    }
}

homeLink.addEventListener('click', (event) => {
    event.preventDefault();
    showSection('home');
    sessionStorage.setItem('currentSection', 'home'); 
});

reservationLink.addEventListener('click', (event) => {
    event.preventDefault();
    showSection('reservation');
    sessionStorage.setItem('currentSection', 'reservation'); 
});

contactsLink.addEventListener('click', (event) => {
    event.preventDefault();
    showSection('contacts');
    sessionStorage.setItem('currentSection', 'contacts');
});

window.addEventListener('load', () => {
    const currentSection = sessionStorage.getItem('currentSection') || 'home'; 
    showSection(currentSection);

    if (currentSection === 'reservation') {
        createCalendar(currentYear, currentMonth);
        generateMonthDropdown();
    }
});

// Picture home fade
document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          let img = entry.target.querySelector('img');
          if (img) img.style.opacity = 1; 
        }
      });
    }, { threshold: 0.7 });
  
    document.querySelectorAll('.info-section').forEach(section => {
      observer.observe(section);
    });
});

// Slideshow 
var slideIndex = 0;
showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("HomeSlides");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 4000); 
}

// Homepage Data area 
const menuData = {
    coffee: {
        title: "About the system",
        image: "Homeportpic.jpg",
        description: "The Le Enchante Reservation System is a sophisticated solution designed to simplify and enhance the reservation process. It allows for seamless management of table bookings, providing real-time updates and ensuring accurate record-keeping. With features tailored to optimize efficiency, the system improves operational workflows and ensures a superior experience for both staff and customers.",
        varieties: [""],
        prices: "",
        
    },
    sweets: {
        title: "Usage of the system",
        image: "Homeportpic2.jpg",
        description: "The Le Enchante Reservation System simplifies table booking by allowing customers to choose their preferred table and time. Staff can efficiently manage reservations, track updates, and ensure smooth service. This system enhances operational efficiency and improves customer satisfaction.",
        varieties: [""],
        prices: "",
        notes: ""
    },
    pastry: {
        title: "Facts",
        image: "Homeportpic3.jpg",
        description: "The Le Enchante Reservation System provides real-time table availability updates and allows customers to select their preferred table, time, and area. Staff can efficiently manage and track reservations, ensuring smooth operations and enhancing customer satisfaction.",
        varieties: [""],
        prices: "",
        notes: ""
    }
};

function openModal(itemType) {
    const modal = document.getElementById('itemModal');
    const data = menuData[itemType];
    
    document.getElementById('modalImage').src = data.image;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDescription').textContent = data.description;
    
    const varietiesList = document.getElementById('modalVarieties');
    varietiesList.innerHTML = data.varieties.map(v => `<li>${v}</li>`).join('');
    
    document.getElementById('modalPrices').textContent = data.prices;
    document.getElementById('modalNotes').textContent = data.notes;
    
    modal.style.display = 'block';
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    const modal = document.getElementById('itemModal');
    if (event.target == modal) {
        closeModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Calendar section
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

function updateMonthDisplay() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthDisplay = document.getElementById("current-month");
    if (monthDisplay) {
        monthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }
}

function createCalendar(year, month) {
    const calendarContainer = document.getElementById("calendar");
    if (!calendarContainer) return;

    calendarContainer.innerHTML = "";

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    weekdays.forEach(day => {
        const weekdayCell = document.createElement("div");
        weekdayCell.textContent = day;
        weekdayCell.classList.add("calendar-cell", "calendar-weekday");
        calendarContainer.appendChild(weekdayCell);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < adjustedFirstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("calendar-cell", "empty-cell");
        calendarContainer.appendChild(emptyCell);
    }

    const selectedDate = sessionStorage.getItem('selectedDate');

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.textContent = day;
        dayCell.classList.add("calendar-cell");

        const selectedDateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (selectedDateISO === selectedDate) {
            dayCell.classList.add("selected");
        }

        dayCell.addEventListener("click", () => {

            const cells = document.querySelectorAll(".calendar-cell");
            cells.forEach(cell => cell.classList.remove("selected"));

            dayCell.classList.add("selected");

            sessionStorage.setItem('selectedDate', selectedDateISO);

            window.location.href = `reservation-details.html?date=${selectedDateISO}`;
        });

        calendarContainer.appendChild(dayCell);
    }

    updateMonthDisplay();

    sessionStorage.setItem('currentMonth', month);
    sessionStorage.setItem('currentYear', year);
}

function changeMonth(direction) {
    currentMonth += direction;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    }

    createCalendar(currentYear, currentMonth);
}

function toggleMonthDropdown() {
    const monthDropdown = document.getElementById("month-dropdown");
    monthDropdown.classList.toggle("hidden");
}

function generateMonthDropdown() {
    const dropdown = document.getElementById("month-dropdown");
    if (!dropdown) return;

    dropdown.innerHTML = "";

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthNames.forEach((month, index) => {
        const monthOption = document.createElement("div");
        monthOption.textContent = month;
        monthOption.addEventListener("click", () => {
            currentMonth = index;
            toggleMonthDropdown();
            createCalendar(currentYear, currentMonth);
        });
        dropdown.appendChild(monthOption);
    });
}

window.addEventListener('load', () => {
    const currentSection = sessionStorage.getItem('currentSection') || 'home';
    showSection(currentSection);

    const savedMonth = sessionStorage.getItem('currentMonth');
    const savedYear = sessionStorage.getItem('currentYear');

    if (savedMonth !== null && savedYear !== null) {
        currentMonth = parseInt(savedMonth);
        currentYear = parseInt(savedYear);
    } else {
        const now = new Date();
        currentMonth = now.getMonth();
        currentYear = now.getFullYear();
    }

    if (currentSection === 'reservation') {
        createCalendar(currentYear, currentMonth);
        generateMonthDropdown();
    }
});

function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${date.getDate()}`;
}

//Notepad Area
function saveNotesToStorage(notes) {
    try {
        localStorage.setItem('cafeNotes', JSON.stringify(notes));
    } catch (e) {
        console.error('Error saving to localStorage:', e);
    }
}

function loadNotesFromStorage() {
    try {
        const savedNotes = localStorage.getItem('cafeNotes');
        return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return [];
    }
}

function createNoteElement(noteData) {
    const noteItem = document.createElement("li");
    
    const textContainer = document.createElement("div");
    textContainer.className = "note-text-container";
    
    const textSpan = document.createElement("span");
    textSpan.textContent = noteData.text;
    textSpan.className = noteData.isChecked ? "line-through" : "";
    textContainer.appendChild(textSpan);
    noteItem.appendChild(textContainer);
    
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "note-actions";
    
    const checkboxBtn = document.createElement("button");
    checkboxBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    checkboxBtn.className = noteData.isChecked ? "text-green-500" : "text-gray-500";
    checkboxBtn.addEventListener("click", () => {
        textSpan.classList.toggle("line-through");
        checkboxBtn.classList.toggle("text-green-500");
        noteData.isChecked = !noteData.isChecked;
        
        const currentNotes = loadNotesFromStorage();
        const noteIndex = currentNotes.findIndex(note => note.text === noteData.text);
        if (noteIndex !== -1) {
            currentNotes[noteIndex].isChecked = noteData.isChecked;
            saveNotesToStorage(currentNotes);
        }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>`;
    deleteBtn.className = "text-gray-500 hover:text-red-500";
    deleteBtn.addEventListener("click", () => {
        const currentNotes = loadNotesFromStorage();
        const updatedNotes = currentNotes.filter(note => note.text !== noteData.text);
        saveNotesToStorage(updatedNotes);
        noteItem.remove();
    });

    actionsContainer.appendChild(checkboxBtn);
    actionsContainer.appendChild(deleteBtn);
    
    noteItem.appendChild(actionsContainer);
    
    return noteItem;
}

function initializeNotes() {
    const saveNoteBtn = document.getElementById("save-note-btn");
    const noteInput = document.getElementById("note-input");
    const savedNotesList = document.getElementById("saved-notes");
    
    if (!savedNotesList || !noteInput || !saveNoteBtn) {
        console.error('Required elements not found');
        return;
    }
    
    savedNotesList.className = "grid grid-cols-3 gap-4 p-4";

    const savedNotes = loadNotesFromStorage();
    savedNotesList.innerHTML = '';
    savedNotes.forEach(noteData => {
        savedNotesList.appendChild(createNoteElement(noteData));
    });

    noteInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            saveNoteBtn.click();
        }
    });

    saveNoteBtn.addEventListener("click", () => {
        const noteText = noteInput.value;
        
        if (!noteText || noteText.trim() === "") {
            alert("Please write a note before saving.");
            return; 
        }
        
        const noteData = {
            text: noteText,
            isChecked: false,
            timestamp: Date.now()
        };
        
        savedNotesList.appendChild(createNoteElement(noteData));
        
        const currentNotes = loadNotesFromStorage();
        currentNotes.push(noteData);
        saveNotesToStorage(currentNotes);
        
        noteInput.value = "";
    });
}

function truncateText(text, maxLength = 50) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength - 3) + '...';
}

function createNoteElement(noteData) {
    const noteItem = document.createElement("li");
    noteItem.className = "note-item";
    
    const textContainer = document.createElement("div");
    textContainer.className = "note-text-container";
    
    const textSpan = document.createElement("span");
    textSpan.textContent = truncateText(noteData.text);
    textSpan.className = noteData.isChecked ? "line-through" : "";
    textContainer.appendChild(textSpan);
    noteItem.appendChild(textContainer);
    
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "note-actions";
    
    const viewBtn = document.createElement("button");
    viewBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    viewBtn.className = "text-gray-500 hover:text-blue-500";
    viewBtn.addEventListener("click", () => openNoteModal(noteData));
    
    const checkboxBtn = document.createElement("button");
    checkboxBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    checkboxBtn.className = noteData.isChecked ? "text-green-500" : "text-gray-500";
    checkboxBtn.addEventListener("click", () => {
        textSpan.classList.toggle("line-through");
        checkboxBtn.classList.toggle("text-green-500");
        noteData.isChecked = !noteData.isChecked;
        
        const currentNotes = loadNotesFromStorage();
        const noteIndex = currentNotes.findIndex(note => note.text === noteData.text);
        if (noteIndex !== -1) {
            currentNotes[noteIndex].isChecked = noteData.isChecked;
            saveNotesToStorage(currentNotes);
        }
    });
    
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>`;
    deleteBtn.className = "text-gray-500 hover:text-red-500";
    deleteBtn.addEventListener("click", () => {
        const currentNotes = loadNotesFromStorage();
        const updatedNotes = currentNotes.filter(note => note.text !== noteData.text);
        saveNotesToStorage(updatedNotes);
        noteItem.remove();
    });
    
    actionsContainer.appendChild(viewBtn);
    actionsContainer.appendChild(checkboxBtn);
    actionsContainer.appendChild(deleteBtn);
    
    noteItem.appendChild(actionsContainer);
    
    return noteItem;
}

function openNoteModal(noteData) {
    let modal = document.getElementById('noteModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'noteModal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content note-modal-content">
                <span class="close-button" onclick="closeNoteModal()">&times;</span>
                <div class="modal-body note-modal-body">
                    <div class="note-modal-text"></div>
                    <div class="note-modal-date"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    const noteText = modal.querySelector('.note-modal-text');
    const noteDate = modal.querySelector('.note-modal-date');
    
    noteText.textContent = noteData.text;
    noteDate.textContent = new Date(noteData.timestamp).toLocaleString();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeNoteModal() {
    const modal = document.getElementById('noteModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeNoteModal();
    }
});

window.onclick = function(event) {
    const modal = document.getElementById('noteModal');
    if (event.target == modal) {
        closeNoteModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const reservationLink = document.getElementById('reservation-link');
    if (reservationLink) {
        reservationLink.addEventListener('click', () => {
            setTimeout(initializeNotes, 100);
        });
    }
    
    if (sessionStorage.getItem('currentSection') === 'reservation') {
        setTimeout(initializeNotes, 100);
    }
});


document.addEventListener('DOMContentLoaded', loadContacts);

        function loadContacts() {
            const contacts = getContacts();
            const contactsList = document.getElementById('contacts-list');
            contactsList.innerHTML = '';
            
            contacts.forEach(contact => {
                addContactToDOM(contact);
            });
        }

        function getContacts() {
            const contacts = localStorage.getItem('contacts');
            return contacts ? JSON.parse(contacts) : [];
        }

        function saveContacts(contacts) {
            localStorage.setItem('contacts', JSON.stringify(contacts));
        }

        function addContact() {
            const nameInput = document.getElementById('name-input');
            const phoneInput = document.getElementById('phone-input');
            const errorMessage = document.getElementById('error-message');
            
            if (!nameInput.value || !phoneInput.value) {
                errorMessage.style.display = 'block';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000);
                return;
            }
            
            const contact = {
                id: Date.now(),
                name: nameInput.value,
                phone: phoneInput.value
            };
            
            const contacts = getContacts();
            contacts.push(contact);
            saveContacts(contacts);
            
            addContactToDOM(contact);
            
            nameInput.value = '';
            phoneInput.value = '';
        }

        function addContactToDOM(contact) {
            const contactsList = document.getElementById('contacts-list');
            const contactElement = document.createElement('div');
            contactElement.className = 'contact-item';
            contactElement.id = `contact-${contact.id}`;
            
            contactElement.innerHTML = `
                <div>${contact.name}</div>
                <div>${contact.phone}</div>
                <button class="delete-btn" onclick="deleteContact(${contact.id})">Delete</button>
            `;
            
            contactsList.appendChild(contactElement);
        }

        function deleteContact(id) {
            const contacts = getContacts();
            const updatedContacts = contacts.filter(contact => contact.id !== id);
            saveContacts(updatedContacts);
            
            const contactElement = document.getElementById(`contact-${id}`);
            if (contactElement) {
                contactElement.remove();
            }
        }

        document.getElementById('phone-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addContact();
            }
});
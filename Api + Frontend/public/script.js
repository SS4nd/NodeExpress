// Hent alle elementer fra formen med at lave nye users
const addItemForm = document.getElementById('addItemForm');
const userList = document.getElementById('userList');
const userDetails = document.getElementById('userDetails');
const userDetailName = document.getElementById('userDetailName');
const userDetailBirthdate = document.getElementById('userDetailBirthdate');
const userDetailActiveSince = document.getElementById('userDetailActiveSince');
const userDetailGenres = document.getElementById('userDetailGenres');
const userDetailLabels = document.getElementById('userDetailLabels');
const userDetailWebsite = document.getElementById('userDetailWebsite');
const userDetailImage = document.getElementById('userDetailImage');
const userDetailShortDescription = document.getElementById('userDetailShortDescription');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const sortAlphabeticalButton = document.getElementById('sortAlphabetical');
const sortReverseAlphabeticalButton = document.getElementById('sortReverseAlphabetical');
const favoriteButton = document.getElementById('favoriteButton');

let usersData = [];

// Tilføj Event Listeners til de øverste knapper
searchButton.addEventListener('click', performSearch);
addItemForm.addEventListener('submit', handleAddUser);
sortAlphabeticalButton.addEventListener('click', sortAlphabetically);
sortReverseAlphabeticalButton.addEventListener('click', sortReverseAlphabetically);
favoriteButton.addEventListener('click', favorite);

// Søge funktionen 
async function performSearch() {
    const searchQuery = searchInput.value.trim().toLowerCase();

    if (searchQuery === '') {
        displayUsers(usersData);
        return;
    }
    // Funktionen søger igennem kunstnere og sender listen af kunstnere der har ordet man søgte på videre til displayUsers
    const filteredUsers = usersData.filter(user => user.name.toLowerCase().includes(searchQuery));
    displayUsers(filteredUsers);
}

// Funktion til at tilføje en kunstner, den får event ved at man klikker submit og sætter dataen ind i json format 
async function handleAddUser(event) {
    event.preventDefault();

    const newUser = {
        name: getValue('name'),
        birthdate: getValue('birthdate'),
        activeSince: getValue('activeSince'),
        genres: getArrayValue('genres'),
        labels: getArrayValue('labels'),
        website: getValue('website'),
        image: getValue('image'),
        shortDescription: getValue('shortDescription')
    };
    // Her prøver den at sende et POST med kunstneren og hvis den kan opdatere den displayUser og ellers sender den en error
    try {
        const response = await fetch('/artists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (response.ok) {
            const addedUser = await response.json();
            displayUser(addedUser);
        }
    } catch (error) {
        console.error('Error adding user:', error);
    }

    addItemForm.reset();
}

// fetchUsers henter alle brugere for at vise dem på listen
async function fetchUsers() {
    try {
        const response = await fetch('/artists');
        if (response.ok) {
            usersData = await response.json();
            displayUsers(usersData);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Her er displayUsers som får en liste med kunstnere og viser dem alle ved at tage hver og sende den til displayUser
function displayUsers(users) {
    userList.innerHTML = '';
    users.forEach(displayUser);
}

// Her er displayUser som tit bliver kaldt for at opdatere eller ændre listen så man kan vise den nyeste liste med kunstnere
function displayUser(user) {
    const li = document.createElement('li');
    li.textContent = user.name;
    li.addEventListener('click', () => showUserDetails(user));
    // Den laver et li element og ændre navnet og tilføjer en event listener så man kan klikke på den og derefter sætter den ind i listen
    userList.appendChild(li);
}

// editUser har en masse keys som er de værdier man kan ændre, dvs. man ik kan ændre favorite på den måde eller id
function editUser(user) {
    console.log(user);

    const keys = ['name', 'birthdate', 'activeSince', 'genres', 'labels', 'website', 'image', 'shortDescription'];
    const updatedUser = {};

    // Den starter en ny user format og går derefter igennem hver key ift den gamle kunstner og de værdier man sætter ind vil så blive sat i den nye user
    for (const key of keys) {
        const newValue = prompt(`Enter the new ${key}:`, user[key]);
        updatedUser[key] = newValue || user[key];
    }
    updatedUser["favorite"] = user.favorite;
    updatedUser["id"] = user.id;

    console.log(updatedUser);
    updateUserData(updatedUser);
}

// updateUserData er til når man redigere en user og skal lave et PUT call til api, den bruger kunstnerens id for at ændre
async function updateUserData(updatedUser) {
    try {
        const response = await fetch(`/artists/${updatedUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
            fetchUsers();
        }
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

// Delete user funktioner arbejder sammen om at finde id på kunstneren man vil slette og sender en DELETE call til api med id man vil slette
function deleteUser(user) {
    deleteUserFromServer(user.id);
}

async function deleteUserFromServer(userId) {
    try {
        const response = await fetch(`/artists/${userId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchUsers();
            userDetails.style.display = 'none';
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

// favorite er når man klikker på favorite knappen som så filtrere efter om de er favoritter og viser dem derefter.
function favorite() {
    const favoriteUsers = usersData.filter(user => user.favorite);
    displayUsers(favoriteUsers);
}

// favoriteAdd omvender booleanen i brugerens favorit tag og opdatere derefter brugeren
async function favoriteAdd(user) {
    user.favorite = !user.favorite;
    updateUserData(user);
}

// Funktion til at vise detaljer om hver kunstner, hvis man klikker på et navn vil denne kode blive kørt som viser daten og knapperne til at ændre kunstneren
function showUserDetails(user) {
    userDetails.style.display = 'block';
    userDetailName.textContent = user.name;
    userDetailBirthdate.textContent = user.birthdate;
    userDetailActiveSince.textContent = user.activeSince;
    userDetailGenres.textContent = user.genres;
    userDetailLabels.textContent = user.labels;
    userDetailWebsite.textContent = user.website;
    userDetailImage.src = user.image;
    userDetailShortDescription.textContent = user.shortDescription;

    const editUserButton = document.getElementById('editUserButton');
    editUserButton.addEventListener('click', () => editUser(user));

    const deleteUserButton = document.getElementById('deleteUserButton');
    deleteUserButton.addEventListener('click', () => deleteUser(user));

    const addFavoriteButton = document.getElementById('addFavoriteButton');
    addFavoriteButton.addEventListener('click', () => favoriteAdd(user));
}

// Funktioner til at sortere listen
function sortAlphabetically() {
    const sortedUsers = [...usersData].sort((a, b) => a.name.localeCompare(b.name));
    displayUsers(sortedUsers);
}

function sortReverseAlphabetically() {
    const sortedUsers = [...usersData].sort((a, b) => b.name.localeCompare(a.name));
    displayUsers(sortedUsers);
}

// Funktioner til at finde elementer og sende værdier tilbage
function getValue(elementId) {
    return document.getElementById(elementId).value;
}

function getArrayValue(elementId) {
    const values = document.getElementById(elementId).value.split(',').map(value => value.trim());
    return values;
}

// Starter koden
fetchUsers();
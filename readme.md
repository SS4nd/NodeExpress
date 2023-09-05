# Node.js og Express

Skole Opgave
![alt text](https://cdn.discordapp.com/attachments/919345485725188096/1145998724242354186/image.png)

## Installation and Running

1. Download Files
2. In your cmd, write "node server.js"
3. Open browser and enter the domain "http://localhost:3000/"

## Frontend usage

### Top buttons

Sort Alphabetically: Sorts users Alphabetically

Sort reverse Alphabetically: Sorts users reverse Alphabetically

Favorite: Sorts users by if the favorite tag on the user is true of false

Search by name / Search: Search after a user and click search to find them

### New user menu

Input:
1. Name
2. Birthday
3. Start date
4. Genres
5. Labels
6. Website URL
7. Image URL
8. Short Description
9. Submit info

### List of artists/users

Each artist name is clickable to show a detailed view

Edit user: A popup alert will show where you can edit each value seperatly

Delete user: Deletes the artist/user youre on

Favorite user: Sets the favorite tag on the artist/user to true, when you filter after favorites it will show

## Api Usage

### Create new user

POST http://localhost:3000/artists
json={
    'name': 'Silas',
    'birthdate': '2003-02-05',
    'activeSince': '2023-01-01',
    'genres': "None",
    'labels': "None",
    'favorite': False,
    'website': 'https://example.com',
    'image': 'https://example.com/image.jpg',
    'shortDescription': 'A brief description'
})

### Get all users

GET http://localhost:3000/artists

### Get user by id

GET http://localhost:3000/artists/id

### Update user

PUT http://localhost:3000/artists/id
json={
    'name': 'Silas',
    'birthdate': '2003-01-01',
    'activeSince': '2020-01-01',
    'genres': "",
    'labels': "",
    'favorite': False,
    'website': 'https://example.com',
    'image': 'https://example.com/image.jpg',
    'shortDescription': 'A brief description'
}

### Delete user

DELETE http://localhost:3000/artists/id



login,register,getUserDetails,verify token middleware all added.

In MongoDB and Mongoose, you can create relationships between documents using reference keys. This is achieved by using the ObjectId type in your Mongoose models to reference another model. When you want to make a relationship between two models, one model can use the _id of the other model as a foreign key or reference key.

Steps to Create a Model with a Reference Key:
Let's say we have two models: User and Post. Each post is created by a user, and we want to store the reference of the user in the Post model.

1. Creating the User Model
Here, we define the User model, which stores information about the user. This model will be referenced by the Post model.

User.js:
```js

const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
```
2. Creating the Post Model with a Reference to User
In the Post model, we reference the User model using ObjectId. This establishes a relationship where each post is created by a user.

Post.js:
```js
const mongoose = require('mongoose');

// Define Post Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,  // ObjectId reference to User model
        ref: 'User',  // This is the model we are referencing (User)
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Post model
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
```
Explanation:
mongoose.Schema.Types.ObjectId:
The author field in the Post schema is of type ObjectId. This tells Mongoose that this field will store an ID that references another document (in this case, a document from the User model).
ref: 'User':
The ref option is used to define the model that this ObjectId refers to. In this case, ref: 'User' tells Mongoose that the author field refers to a document in the User collection.
3. Populating References in Queries
When you query a Post, you can use Mongoose's populate() method to replace the ObjectId in the author field with the actual user document.

Example of Fetching Posts with Author Information:
```js
const Post = require('./models/Post');
const User = require('./models/User');

// Example: Finding posts and populating the author (User) data
Post.find()
    .populate('author')  // Populates the author field with User details
    .exec((err, posts) => {
        if (err) {
            console.error(err);
        } else {
            console.log(posts);
        }
    });

```
populate('author'): This replaces the ObjectId of the author with the actual document from the User model, allowing you to access the user's details along with the post.
4. Example of Creating a New Post with a User Reference
To create a post associated with a user, you'll need the user's _id:

Create a User and a Post:
```js
const User = require('./models/User');
const Post = require('./models/Post');

// Creating a new User
const newUser = new User({
    name: 'John Doe',
    email: 'john.doe@example.com'
});

newUser.save()
    .then(user => {
        // Once the user is saved, we can create a post for this user
        const newPost = new Post({
            title: 'My First Post',
            content: 'This is the content of my first post',
            author: user._id  // Reference the user's _id in the author field
        });

        return newPost.save();
    })
    .then(post => {
        console.log('Post created successfully:', post);
    })
    .catch(err => {
        console.error('Error:', err);
    });
```
5. Example of Querying Posts with Populated Author Information
To fetch posts along with the user's details (author), you can use the following query with populate():

```js
Post.find()
    .populate('author', 'name email')  // Only populate the 'name' and 'email' fields of the author
    .exec((err, posts) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Posts with author information:', posts);
        }
    });
```
No, there should not be a comma between 'name' and 'email' in the .populate() method.

In Mongoose, when you use the populate() method and want to select specific fields from the populated document, you pass a space-separated string of field names. The fields are specified within the same string, separated by spaces, not by commas.

Correct Syntax:
```js
Post.find()
    .populate('author', 'name email')  // Space-separated field names without commas
    .exec((err, posts) => {
        if (err) {
            console.error(err);
        } else {
            console.log(posts);
        }
    });
```
Explanation:
populate('author', 'name email'): This tells Mongoose to populate the author field and include only the name and email fields from the referenced User model.
You can include multiple fields by separating them with spaces in a single string, e.g., 'name email'.
Example with Multiple Fields:
If you want to populate more fields, such as name, email, and userType, you would still separate them with spaces:

```js
Post.find()
    .populate('author', 'name email userType')
    .exec((err, posts) => {
        if (err) {
            console.error(err);
        } else {
            console.log(posts);
        }
    });
```
Note:
If you want to exclude certain fields, you can use a minus sign (-) before the field name, for example:
```js
.populate('author', '-password')  // This will exclude the 'password' field
```


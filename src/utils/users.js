const users = [];

const addUser = ({ id, username, room }) => {
  // Format data provided by user \\
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate data provided user \\
  if (!username || !room) {
    return {
      error: "Username and Room are required !!",
    };
  }

  // Check for existing user \\
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username \\
  if (existingUser) {
    return {
      error: "Username is in use !!",
    };
  }

  // Store valid user \\
  const user = { id, username, room };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  // Find the first index of user data in the users array with id provided \\
  const index = users.findIndex((user) => user.id === id);

  // Remove the user if found and return the object data of the user which got removed \\
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  // Returns the user data object matching with the id in the users array \\
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  // Format data provided by user \\
  room = room.trim().toLowerCase();

  // Returns the array of data objects matching same room as provided \\
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};

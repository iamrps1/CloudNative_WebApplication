// Mock users database
const users = [
    {
        id: '1',
        email: 'admin@example.com',
        password: '$2a$12$k8Y.ZbV4Rd4OI8/6TXxMJeZN9y5GXo0uIoEz5wj0CL9OCJHvk3IGi', // "password123"
        role: 'ADMIN',
        name: 'Admin User'
    }
];

export const getUserByEmail = async (email) => {
    return users.find(user => user.email === email);
};

export const getUserById = async (id) => {
    return users.find(user => user.id === id);
};

export const createUser = async (userData) => {
    const newUser = {
        id: String(users.length + 1),
        ...userData
    };
    users.push(newUser);
    return newUser;
};

export default users; 
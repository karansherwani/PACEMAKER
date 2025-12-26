import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'app/data/users.json');

export interface User {
    id: string;
    authMethod: 'email' | 'netid';
    identifier: string; // The email or netId
    password: string; // Stored as plain text for this demo (In real app, hash this!)
    fullName: string;
    studentId: string;
}

// Initialize DB if not exists
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '[]');
}

export const getUsers = (): User[] => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

export const saveUser = (user: User) => {
    const users = getUsers();
    users.push(user);
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
};

export const findUser = (identifier: string): User | undefined => {
    const users = getUsers();
    return users.find(u => u.identifier === identifier);
};

export const updateUserPassword = (identifier: string, newPassword: string) => {
    const users = getUsers();
    const index = users.findIndex(u => u.identifier === identifier);
    if (index !== -1) {
        users[index].password = newPassword;
        fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
        return true;
    }
    return false;
};

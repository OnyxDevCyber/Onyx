export interface User {
  id: string;
  name: string;
  username: string;
  email: string; // Added email
  bio: string;
  avatarUrl: string;
  chatTheme: 'onyx' | 'midnight' | 'forest' | 'crimson' | 'royal';
  isBot?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  password?: string; // In a real app, this would be hashed. Storing plain for demo.
}

// Helper to simulate a database delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem('onyx_users');
    return users ? JSON.parse(users) : [];
  },

  addUser: (user: User) => {
    const users = db.getUsers();
    // Check if username or email exists
    if (users.some(u => u.username === user.username || u.email === user.email)) {
      throw new Error('User already exists');
    }
    users.push(user);
    localStorage.setItem('onyx_users', JSON.stringify(users));
    return user;
  },

  updateUser: (updatedUser: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('onyx_users', JSON.stringify(users));
    }
  },

  findUser: (username: string) => {
    const users = db.getUsers();
    return users.find(u => u.username === username || u.email === username);
  },
  
  // Initialize with Bot if empty
  init: () => {
    if (typeof window === 'undefined') return;
    const users = db.getUsers();
    if (!users.some(u => u.isBot)) {
      const bot: User = {
        id: '99',
        name: 'Onyx Bot',
        username: 'onyx_bot',
        email: 'bot@onyx.com',
        bio: 'I am the system bot.',
        avatarUrl: '',
        chatTheme: 'onyx',
        isBot: true,
        isOnline: true,
        lastSeen: 'Always'
      };
      users.push(bot);
      localStorage.setItem('onyx_users', JSON.stringify(users));
    }
  }
};

import type { User } from '../types/user';

/** Simple in-memory data store — replace with a database adapter in production. */
class UserStore {
  private users: Map<string, User> = new Map();
  private nextId = 1;

  findAll(): User[] {
    return Array.from(this.users.values());
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  findByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const now = new Date().toISOString();
    const user: User = {
      id: String(this.nextId++),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  }

  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): User | undefined {
    const existing = this.users.get(id);
    if (!existing) return undefined;

    const updated: User = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.users.delete(id);
  }
}

export const userStore = new UserStore();

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { User } from "@supabase/auth-js";
import { createAdminUser, deleteAdminUser } from "./users.actions";

type Props = {
  authUser: User | null;
  initialUsers: User[];
};

export default function UserClient({ authUser, initialUsers }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  async function handleDelete(id: string) {
    await deleteAdminUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  async function handleCreate(formData: FormData) {
    await createAdminUser(formData);
    // optionally re-fetch or optimistically add new user
  }

  if (!authUser) return <p>Error loading users.</p>;

  return (
    <div className="space-y-6 ml-4">
      <h1 className="text-2xl font-bold">Users Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email || "No email"}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No users found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div>
        <h2>Create new user</h2>
        <form className="flex flex-col w-72" action={handleCreate}>
          <label htmlFor="email">Email:</label>
          <input className="border border-gray-500 rounded-md" id="email" name="email" type="email" required />
          <label htmlFor="password">Password:</label>
          <input className="border border-gray-500 rounded-md" id="password" name="password" type="password" required />
          <Button className="w-20 mt-4" type="submit">Create</Button>
        </form>
      </div>
    </div>
  );
}


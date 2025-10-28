// app/dashboard/users/page.tsx
// (Users page - manage users, stats by country)
// Assume cleaning means deleting inactive, etc.

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { deleteUser, getCountryStats } from "./users.actions";


// Server action to delete user (clean)


export default async function UsersPage() {
  const supabase = createClient();

  const { data: users, error } = await supabase.from('users').select('*');

  if (error) return <p>Error loading users.</p>;

  const countryStats = await getCountryStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users Management</h1>
      <div>
        <h2 className="text-xl">Stats by Country</h2>
        <ul>
          {Object.entries(countryStats).map(([country, count]) => (
            <li key={country}>{country}: {count}</li>
          ))}
        </ul>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.country}</TableCell>
              <TableCell>
                <form action={deleteUser.bind(null, user.id)}>
                  <Button type="submit" variant="destructive">Delete</Button>
                </form>
              </TableCell>
            </TableRow>
          )) || <TableRow><TableCell colSpan={4}>No users.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}
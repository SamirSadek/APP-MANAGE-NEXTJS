'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
// import { FormData } from '@/lib/types';
import { getFormData, deleteFormData } from '@/lib/storage';
import { Search, Trash2, UserRoundPen } from 'lucide-react';

export default function DataPage() {
    const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const formData = getFormData();

  const filteredData = formData.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteFormData(id);
    setDeleteId(null);
    toast({
      title: 'Success',
      description: 'Entry deleted successfully',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Applications List</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
  {filteredData.length > 0 ? (
    filteredData.map((entry) => (
      <TableRow key={entry.id}>
        <TableCell>{entry.name}</TableCell>
        <TableCell>{entry.email}</TableCell>
        <TableCell>{entry.experienceLevel}</TableCell>
        <TableCell>{entry.skills.join(", ")}</TableCell>
        <TableCell>{entry.employmentStatus}</TableCell>
        <TableCell className="flex items-start justify-start">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/form?id=${entry.id}`)}
            className="mr-3"
          >
            <UserRoundPen className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setDeleteId(entry.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
        No applications found.{" "}
        <span
          className="text-blue-600 cursor-pointer underline"
          onClick={() => router.push("/form")}
        >
          Submit your application
        </span>
        .
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              application entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    </div>
  );
}
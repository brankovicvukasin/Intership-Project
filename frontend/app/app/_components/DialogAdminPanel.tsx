"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import {
  addNewUser,
  deleteUser,
  getAllUsers,
} from "@/services/authenticationService";

interface User {
  _id: string;
  email: string;
  role: string;
}

export function DialogAdminPanel() {
  const [addEmail, setAddEmail] = useState<string>("");
  const [addPassword, setPassword] = useState<string>("");
  const [addRole, setAddRole] = useState<string>("user");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const limit = 6;

  useEffect(() => {
    setLoading(true);
    const fetchKeywords = async () => {
      try {
        const result = await getAllUsers(limit, currentPage);
        setAllUsers(result.data);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
        setTotalUsers(result.totalUsers);
        setLoading(false);
      } catch (error) {
        toast.error("There was an Error!");
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchKeywords();
  }, [currentPage]);

  const handleAddNewUserClick = async () => {
    try {
      const result = await addNewUser(addEmail, addPassword, addRole);
      window.location.reload();
      toast.success("New User Added Successfully");
    } catch (error) {
      toast.error("There was an Error!");
      console.error("Failed to add new user:", error);
    }
  };

  const handleDeleteUserClick = async (email: string) => {
    try {
      const result = await deleteUser(email);
      window.location.reload();
      toast.success("User Deleted Successfully");
    } catch (error) {
      toast.error("There was an Error!");
      console.error("Failed to delete new user:", error);
    }
  };

  const handleNazad = () => {
    setCurrentPage(1 === currentPage ? currentPage : currentPage - 1);
  };

  const handleNapred = () => {
    setCurrentPage(
      totalPages === currentPage || totalPages === 0
        ? currentPage
        : currentPage + 1
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button variant="outline" className="font-medium hover:bg-blue-100 ">
          Admin Panel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] h-[630px]" tabIndex={-1}>
        <DialogHeader>
          <DialogTitle>User Management</DialogTitle>
          <DialogDescription>
            Make sure you entered valid credentials!
          </DialogDescription>
        </DialogHeader>

        <DialogHeader>
          <div className="flex space-x-4">
            <input
              placeholder="Email..."
              className="border w-full p-2 rounded focus:outline-none focus:ring-0"
              onChange={(e) => setAddEmail(e.target.value)}
            />

            <input
              placeholder="Password..."
              className="border w-full p-2 rounded focus:outline-none focus:ring-0"
              onChange={(e) => setPassword(e.target.value)}
            />
            <select
              className="border p-3 rounded focus:outline-none focus:ring-0 px-10"
              onChange={(e) => setAddRole(e.target.value)}
              value={addRole}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              className="bg-green-500 rounded-xl p-3 text-white w-full"
              onClick={handleAddNewUserClick}
            >
              Add New User
            </button>
          </div>
        </DialogHeader>

        <div className="py-4 h-[400px]">
          {allUsers.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200 border rounded-xl shadow-sm ">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-green-800">
                        {user._id}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-red-500 hover:text-red-400"
                        onClick={() => handleDeleteUserClick(user.email)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <DialogFooter>
          <div className="flex justify-center gap-8 items-center w-full">
            <Button variant="outline" className="w-20" onClick={handleNazad}>
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>

            <Button variant="outline" className="w-20" onClick={handleNapred}>
              Next
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

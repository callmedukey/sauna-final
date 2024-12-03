"use client";

import { User } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { deleteUser, updateUserPoints } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsersTableProps {
  users: Pick<User, "id" | "name" | "email" | "phone" | "point">[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<Pick<
    User,
    "id" | "name" | "point"
  > | null>(null);
  const [newPoints, setNewPoints] = useState<string>("");

  const handleUpdatePoints = async () => {
    if (!selectedUser) return;

    try {
      const points = parseInt(newPoints);
      if (isNaN(points)) {
        alert("올바른 포인트를 입력해주세요.");
        return;
      }

      const result = await updateUserPoints(selectedUser.id, points);

      if (!result.success) {
        throw new Error(result.message);
      }

      setSelectedUser(null);
      setNewPoints("");
    } catch (error) {
      console.error("Error updating points:", error);
      alert(
        error instanceof Error ? error.message : "포인트 수정에 실패했습니다."
      );
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("사용자를 삭제하시겠습니까?")) return;

    try {
      const result = await deleteUser(id);

      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(
        error instanceof Error ? error.message : "사용자 삭제에 실패했습니다."
      );
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>전화 번호</TableHead>
            <TableHead>이메일</TableHead>
            <TableHead>보유 포인트</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                사용자가 없습니다
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="whitespace-nowrap">
                <TableCell className="min-w-[6.25rem]">{user.name}</TableCell>
                <TableCell className="min-w-[6.25rem]">{user.phone}</TableCell>
                <TableCell className="min-w-[6.25rem]">{user.email}</TableCell>
                <TableCell className="min-w-[6.25rem]">
                  {user.point?.toLocaleString() ?? 0}P
                </TableCell>
                <TableCell className="w-[5rem]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">메뉴 열기</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          setSelectedUser({
                            id: user.id,
                            name: user.name,
                            point: user.point ?? 0,
                          })
                        }
                      >
                        포인트 수정
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        사용자 삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>포인트 수정</DialogTitle>
            <DialogDescription>
              {selectedUser?.name}님의 포인트를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <label htmlFor="points" className="w-24">
                현재 포인트
              </label>
              <span>{selectedUser?.point.toLocaleString()}P</span>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="points" className="w-24">
                새로운 포인트
              </label>
              <Input
                id="points"
                type="number"
                value={newPoints}
                onChange={(e) => setNewPoints(e.target.value)}
                className="max-w-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              취소
            </Button>
            <Button onClick={handleUpdatePoints}>수정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

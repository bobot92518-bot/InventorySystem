import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";

interface Item {
  id: string;
  name: string;
  department: string;
  status: "available" | "borrowed" | "pending" | "maintenance";
  borrower?: string;
  borrowDate?: string;
  returnDate?: string;
  category: string;
  quantity: number;
}

interface ItemsTableProps {
  items?: Item[];
  type?: "available" | "borrowed" | "pending";
  onView?: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  onBorrow?: (item: Item) => void;
  onReturn?: (item: Item) => void;
  onApprove?: (item: Item) => void;
  onReject?: (item: Item) => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({
  items = defaultItems,
  type = "available",
  onView,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
  onApprove,
  onReject,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter items based on search term and department filter
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment
      ? item.department === filterDepartment
      : true;
    return matchesSearch && matchesDepartment;
  });

  // Paginate items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Get unique departments for filter dropdown
  const departments = [...new Set(items.map((item) => item.department))];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "available":
        return "secondary";
      case "borrowed":
        return "default";
      case "pending":
        return "outline";
      case "maintenance":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSearchTerm("");
                setFilterDepartment("");
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableCaption>List of {type} items</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Item ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                {(type === "borrowed" || type === "pending") && (
                  <TableHead>Borrower</TableHead>
                )}
                {type === "borrowed" && <TableHead>Return Date</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    {(type === "borrowed" || type === "pending") && (
                      <TableCell>{item.borrower || "N/A"}</TableCell>
                    )}
                    {type === "borrowed" && (
                      <TableCell>{item.returnDate || "N/A"}</TableCell>
                    )}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        {type === "available" && onBorrow && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onBorrow(item)}
                          >
                            Borrow
                          </Button>
                        )}
                        {type === "borrowed" && onReturn && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReturn(item)}
                          >
                            Return
                          </Button>
                        )}
                        {type === "pending" && onApprove && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onApprove(item)}
                          >
                            Approve
                          </Button>
                        )}
                        {type === "pending" && onReject && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onReject(item)}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={type === "available" ? 7 : 9}
                    className="text-center py-10"
                  >
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};

// Default mock data
const defaultItems: Item[] = [
  {
    id: "IT001",
    name: "Dell Laptop XPS 15",
    department: "IT",
    status: "available",
    category: "Electronics",
    quantity: 5,
  },
  {
    id: "IT002",
    name: "HP Printer LaserJet Pro",
    department: "IT",
    status: "borrowed",
    borrower: "John Doe",
    borrowDate: "2023-05-10",
    returnDate: "2023-05-20",
    category: "Electronics",
    quantity: 2,
  },
  {
    id: "SCI001",
    name: "Microscope Set",
    department: "Science",
    status: "available",
    category: "Lab Equipment",
    quantity: 10,
  },
  {
    id: "SCI002",
    name: "Chemistry Lab Kit",
    department: "Science",
    status: "pending",
    borrower: "Jane Smith",
    category: "Lab Equipment",
    quantity: 3,
  },
  {
    id: "LIB001",
    name: "History Textbooks",
    department: "Library",
    status: "available",
    category: "Books",
    quantity: 25,
  },
  {
    id: "LIB002",
    name: "Literature Collection",
    department: "Library",
    status: "borrowed",
    borrower: "Mark Johnson",
    borrowDate: "2023-05-05",
    returnDate: "2023-06-05",
    category: "Books",
    quantity: 15,
  },
  {
    id: "SPT001",
    name: "Basketball Set",
    department: "Sports",
    status: "available",
    category: "Sports Equipment",
    quantity: 8,
  },
  {
    id: "SPT002",
    name: "Soccer Balls",
    department: "Sports",
    status: "maintenance",
    category: "Sports Equipment",
    quantity: 12,
  },
  {
    id: "ART001",
    name: "Paint Supplies",
    department: "Arts",
    status: "borrowed",
    borrower: "Lisa Wong",
    borrowDate: "2023-05-12",
    returnDate: "2023-05-19",
    category: "Art Supplies",
    quantity: 20,
  },
  {
    id: "ART002",
    name: "Drawing Tablets",
    department: "Arts",
    status: "pending",
    borrower: "David Chen",
    category: "Electronics",
    quantity: 5,
  },
  {
    id: "MUS001",
    name: "Acoustic Guitars",
    department: "Music",
    status: "available",
    category: "Instruments",
    quantity: 7,
  },
  {
    id: "MUS002",
    name: "Digital Piano",
    department: "Music",
    status: "borrowed",
    borrower: "Sarah Miller",
    borrowDate: "2023-05-01",
    returnDate: "2023-05-30",
    category: "Instruments",
    quantity: 2,
  },
];

export default ItemsTable;

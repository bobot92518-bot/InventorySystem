import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, CheckCircle, ChevronDown, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const borrowingFormSchema = z.object({
  itemId: z.string().min(1, { message: "Please select an item" }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be at least 1" }),
  purpose: z
    .string()
    .min(5, { message: "Purpose must be at least 5 characters" }),
  returnDate: z.date({ required_error: "Return date is required" }),
  department: z.string().min(1, { message: "Please select a department" }),
});

const returnFormSchema = z.object({
  itemId: z.string().min(1, { message: "Please select an item" }),
  condition: z
    .string()
    .min(5, { message: "Condition notes must be at least 5 characters" }),
});

interface BorrowingFormProps {
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
  availableItems?: Array<{ id: string; name: string }>;
  borrowedItems?: Array<{ id: string; name: string }>;
  departments?: Array<{ id: string; name: string }>;
}

const BorrowingForm = ({
  onSubmit = () => {},
  isLoading = false,
  availableItems = [
    { id: "1", name: "Laptop" },
    { id: "2", name: "Projector" },
    { id: "3", name: "Whiteboard" },
  ],
  borrowedItems = [
    { id: "4", name: "Printer" },
    { id: "5", name: "Scanner" },
  ],
  departments = [
    { id: "1", name: "IT Department" },
    { id: "2", name: "Science Department" },
    { id: "3", name: "Math Department" },
    { id: "4", name: "English Department" },
  ],
}: BorrowingFormProps) => {
  const [activeTab, setActiveTab] = useState("borrow");

  const borrowForm = useForm<z.infer<typeof borrowingFormSchema>>({
    resolver: zodResolver(borrowingFormSchema),
    defaultValues: {
      itemId: "1",
      quantity: 1,
      purpose: "",
      department: "1",
    },
  });

  const returnForm = useForm<z.infer<typeof returnFormSchema>>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      itemId: "4",
      condition: "",
    },
  });

  const handleBorrowSubmit = (data: z.infer<typeof borrowingFormSchema>) => {
    onSubmit({ ...data, type: "borrow" });
  };

  const handleReturnSubmit = (data: z.infer<typeof returnFormSchema>) => {
    onSubmit({ ...data, type: "return" });
  };

  return (
    <Card className="w-full max-w-2xl bg-white">
      <CardHeader>
        <CardTitle>Item Borrowing & Return</CardTitle>
        <CardDescription>
          Submit a request to borrow items or process a return for borrowed
          items.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="borrow">Borrow Request</TabsTrigger>
            <TabsTrigger value="return">Return Item</TabsTrigger>
          </TabsList>

          <TabsContent value="borrow">
            <Form {...borrowForm}>
              <form
                onSubmit={borrowForm.handleSubmit(handleBorrowSubmit)}
                className="space-y-4 pt-4"
              >
                <FormField
                  control={borrowForm.control}
                  name="itemId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Item</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an item to borrow" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose from available items
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={borrowForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Number of items to borrow
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={borrowForm.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain why you need this item"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Briefly describe why you need to borrow this item
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={borrowForm.control}
                  name="returnDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expected Return Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={"w-full pl-3 text-left font-normal"}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() ||
                              date >
                                new Date(
                                  new Date().setMonth(
                                    new Date().getMonth() + 3,
                                  ),
                                )
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When will you return this item?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={borrowForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Select your department</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardFooter className="px-0 pt-6">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Submit Borrowing Request"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="return">
            <Form {...returnForm}>
              <form
                onSubmit={returnForm.handleSubmit(handleReturnSubmit)}
                className="space-y-4 pt-4"
              >
                <FormField
                  control={returnForm.control}
                  name="itemId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Borrowed Item</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an item to return" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {borrowedItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose from items you have borrowed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={returnForm.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Condition</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the condition of the item being returned"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Note any damages or issues with the item
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardFooter className="px-0 pt-6">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Process Return"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BorrowingForm;

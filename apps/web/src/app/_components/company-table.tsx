import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@duck/ui/table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    grade: "5/5",
    paymentMethod: "Credit Card",
    categoryName: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    grade: "5/5",
    paymentMethod: "PayPal",
    categoryName: "Credit Card",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    grade: "5/5",
    paymentMethod: "Bank Transfer",
    categoryName: "Credit Card",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    grade: "5/5",
    paymentMethod: "Credit Card",
    categoryName: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    grade: "5/5",
    paymentMethod: "PayPal",
    categoryName: "Credit Card",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    grade: "5/5",
    paymentMethod: "Bank Transfer",
    categoryName: "Credit Card",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    grade: "5/5",
    paymentMethod: "Credit Card",
    categoryName: "Credit Card",
  },
];

export function CompanyTable() {
  return (
    <Table>
      <TableCaption>Checked tenders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Tender ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Category Name</TableHead>
          <TableHead className="text-right">Grade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">
              <a
                className="underline"
                href={`https://etender.uzex.uz/lot/${invoice.invoice}`}
              >
                {invoice.invoice}
              </a>
            </TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell>{invoice.categoryName}</TableCell>
            <TableCell className="text-right">
              <Link href={`/companies/${invoice.invoice}`}>
                {invoice.grade}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

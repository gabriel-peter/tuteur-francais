"use client"
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/catalyst-ui/table";
import { timeFormatter } from "@/app/utils";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "@/components/catalyst-ui/dropdown";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { Alert, AlertTitle, AlertActions } from "@/components/catalyst-ui/alert";
import { useState } from "react";
import { Button } from "@/components/catalyst-ui/button";
import { MongoAnnotatedExcerpt } from "@/db/models/reading/excerpt";
import { deleteExcerpt } from "@/db/models/reading/actions";

/***
 * Data fetch strategy:
 * - Make abstract server components for each model that getAll, getById, and update
 * Children can be client components. 
 */


export default function RecentAnnotations({ excerpts }: { excerpts: MongoAnnotatedExcerpt[] }) {
  console.log(excerpts)
  return (<Table>
    <TableHead>
      <TableRow>
        <TableHeader>Title</TableHeader>
        <TableHeader>Created on</TableHeader>
        <TableHeader>Terms Saved</TableHeader>
        <TableHeader></TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      {excerpts.map((excerpt, index) => (
       <RecentAnnotationRow excerpt={excerpt} key={index} />
      ))}
    </TableBody>
  </Table>)
}

function RecentAnnotationRow({excerpt}: {excerpt: MongoAnnotatedExcerpt}) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  return (
    <TableRow
    href={`/reading/${excerpt._id}`}>
    <TableCell className="font-medium">{excerpt.title}</TableCell>
    <TableCell>{timeFormatter.format(new Date(excerpt.createdAt))}</TableCell>
    <TableCell className="text-zinc-500">{excerpt.terms.length}</TableCell>
    <TableCell>
      <Dropdown>
        <DropdownButton plain aria-label="More options">
          <EllipsisHorizontalIcon />
        </DropdownButton>
        <DropdownMenu anchor="bottom end">
          {/* Shows more of TermTuple like examples */}
          {/* <DropdownItemWithAlert item={excerpt} action={() => deleteExcerpt(excerpt._id)} /> */}
          <DropdownItem onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            setIsAlertOpen(true);
          }}>
            Remove
            </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Alert open={isAlertOpen} onClose={setIsAlertOpen}>
        <AlertTitle>Are you sure you want to delete '{excerpt.title}'?</AlertTitle>
        {/* <AlertDescription>
          The refund will be reflected in the customer’s bank account 2 to 3 business days after processing.
      </AlertDescription> */}
        <AlertActions>
          <Button plain onClick={() => setIsAlertOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => deleteExcerpt(excerpt._id).then(
            () => location.reload() // router.refresh only works for server components
          )}>Delete</Button>
        </AlertActions>
      </Alert>
    </TableCell>
  </TableRow>
  )
}
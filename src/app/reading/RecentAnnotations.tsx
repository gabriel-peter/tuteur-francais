import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/catalyst-ui/table";
import { AnnotatedExcerpt, MongoAnnotatedExcerpt } from "@/db/models/excerpt";
import { timeFormatter } from "@/app/utils";

/***
 * Data fetch strategy:
 * - Make abstract server components for each model that getAll, getById, and update
 * Children can be client components. 
 */


export default function RecentAnnotations({excerpts}: {excerpts: MongoAnnotatedExcerpt[]}) {
    console.log(excerpts)
    return (  <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Title</TableHeader>
            <TableHeader>Created on</TableHeader>
            <TableHeader>Terms Saved</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {excerpts.map((excerpt, index) => (
            <TableRow href={`/reading/${excerpt._id}`} key={index}>
              <TableCell className="font-medium">{excerpt.title}</TableCell>
              <TableCell>{timeFormatter.format(new Date(excerpt.createdAt))}</TableCell>
              <TableCell className="text-zinc-500">{excerpt.terms.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>)
}
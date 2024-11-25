"use client";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/catalyst-ui/table";
import { LoadingButton } from "@/components/LoadingButton";
import { TermTuple } from "@/db/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";


export type QuizPartial = { title: string, terms: TermTuple[]; }

export function TermTuplePreview(
    
    { item, createQuiz }: { item: QuizPartial; createQuiz: (x: QuizPartial) => Promise<any>; }) {
    const router = useRouter()
    return (<>
        <Table striped className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
            <TableHead>
                <TableRow>
                    <TableHeader></TableHeader>
                    <TableHeader></TableHeader>
                    {/* <TableHeader></TableHeader> */}
                </TableRow>
            </TableHead>
            <TableBody>
                {item.terms?.map((term, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{term.firstTerm.word}</TableCell>
                        <TableCell>{term.secondTerm.word}</TableCell>
                        {/* <TableCell className="text-zinc-500">{term.misc}</TableCell> */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <LoadingButton
            action={() => createQuiz(item).then(() => location.reload())}
            requestStateMap={{
                "SUCCESS": "Create Quiz",
                "LOADING": "Loading ...",
                "FAILED": "Failed: Try Again",
                "IDLE": "Create Quiz"
            }} />
    </>);
}

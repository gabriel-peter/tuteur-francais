import { Term, TermTuple } from "@/db/types";
import { Listbox, ListboxLabel, ListboxOption } from "@/components/catalyst-ui/listbox";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem } from "../catalyst-ui/dropdown";
import { TableRow, TableCell } from "../catalyst-ui/table";
import { Field } from "../catalyst-ui/fieldset";
import { TermTupleDialog } from "./TermTupleDialog";

const TermReselectListbox = ({ term, editTermAction }: { term: Term, editTermAction: (x: Term) => void }) => {
    const [translationValue, setTranslationValue] = useState(term.word)
    console.log(term, translationValue)
    // Detects change in state made by Listbox and causes full object change in parent.
    useEffect(() => {
        if (term.word !== translationValue) {
        editTermAction({ ...term, word: translationValue })
        }
    }, [translationValue])
    if (!term.otherPossibilies || term.otherPossibilies.length === 0) {
        return term.word
    }
    console.log()
    return (<Field>
        <Listbox value={translationValue} onChange={value =>
            setTranslationValue(value)
            // editTermAction({ ...term, word: value })
        }>
            {/* Sadly complicated, other possibilities include the main 
            translation so you need to append them and get the unique Set */}
            {[...new Set([term.word, ...term.otherPossibilies])].map((possibility, index) => (
                <ListboxOption value={possibility} key={index}>
                    <ListboxLabel>{possibility}</ListboxLabel>
                </ListboxOption>
            ))}
        </Listbox>
    </Field>);
};

export function TermTupleRows({
    terms,
    removeAction,
    editAction
}: {
    terms: TermTuple[],
    removeAction: (x: TermTuple) => void,
    editAction: (newTermTuple: TermTuple, oldTermTuple: TermTuple) => void
}) {
    return (
        <>
            {terms.map((term, index) => (
                <>
                {/** WATCH OUT FOR INDEX AS KEY, that fucks up rendering...... */}
                    <TermTupleDialog termTuple={term} key={term._id}>
                        {({ setIsOpen }) =>
                            <TableRow>
                                <TableCell className="font-medium">{term.firstTerm.word}</TableCell>
                                <TableCell>
                                    <TermReselectListbox term={term.secondTerm} editTermAction={
                                        (newSecondTerm: Term) => {
                                            const newTermTuple: TermTuple = { ...term, ...{ secondTerm: newSecondTerm } }
                                            editAction(newTermTuple, term)
                                            console.log("New Main Translation Selected", newSecondTerm)
                                        }
                                    } />
                                </TableCell>
                                <TableCell>{term.notes}</TableCell>
                                <TableCell className="text-zinc-500">
                                    <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                                        <Dropdown>
                                            <DropdownButton plain aria-label="More options">
                                                <EllipsisHorizontalIcon />
                                            </DropdownButton>
                                            <DropdownMenu anchor="bottom end">
                                                {/* Shows more of TermTuple like examples */}
                                                <DropdownItem onClick={() => setIsOpen(true)}>View</DropdownItem>
                                                <DropdownItem onClick={() => removeAction(term)}>Remove</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </TableCell>
                            </TableRow>
                        }
                    </TermTupleDialog>
                </>
            ))}
        </>
    )
}

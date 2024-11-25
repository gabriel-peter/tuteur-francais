import { TermTuple } from "@/db/types";
import { useState } from "react";
import { DescriptionList, DescriptionTerm, DescriptionDetails } from "../catalyst-ui/description-list";
import { DialogBody, DialogActions, Dialog, DialogTitle } from "../catalyst-ui/dialog";
import { Button } from "../catalyst-ui/button";

// ChatGPT function 
function flattenObject(obj: Record<string, any>, parentKey = "", result: Record<string, any> = {}): Record<string, any> {
    for (let key in obj) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
            flattenObject(obj[key], newKey, result);
        } else {
            result[newKey] = obj[key];
        }
    }
    return result;
}

export const TermTupleDialog = ({
    termTuple,
    children
}: {
    termTuple: TermTuple,
    // I apologize in advance for this signature.
    children: ({ setIsOpen }: { setIsOpen: (x: boolean) => void }) => React.ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            {children({ setIsOpen })}
            <Dialog open={isOpen} onClose={setIsOpen}>
                <DialogTitle>Term</DialogTitle>
                {/* <DialogDescription>
          The refund will be reflected in the customer’s bank account 2 to 3 business days after processing.
        </DialogDescription> */}
                <DialogBody>
                    <DescriptionList>
                        {Object.entries(flattenObject(termTuple)).map(([key, value]) =>
                        (<><DescriptionTerm>{key}</DescriptionTerm>
                            <DescriptionDetails>{value}</DescriptionDetails></>))}
                    </DescriptionList>
                </DialogBody>
                <DialogActions>
                    <Button plain onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setIsOpen(false)}>Refund</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
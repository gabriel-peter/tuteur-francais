"use client";
import { Alert, AlertTitle, AlertDescription, AlertActions } from "@/components/catalyst-ui/alert";
import { Button } from "@/components/catalyst-ui/button";

export function DeleteDialog({ action, title, setIsOpen, isOpen }: { action: () => Promise<any>; title: string; setIsOpen: (x: boolean) => void; isOpen: boolean; }) {
    return (
        <>
            <Alert open={isOpen} onClose={setIsOpen}>
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>
                    {/* The refund will be reflected in the customer’s bank account 2 to 3 business days after processing. */}
                </AlertDescription>
                <AlertActions>
                    <Button plain onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => action().then(() => setIsOpen(false))}>Delete</Button>
                </AlertActions>
            </Alert>
        </>
    );
}

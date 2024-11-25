"use client"
import PageHeader from "@/components/PageHeader";
import { Text } from "@/components/catalyst-ui/text";

import * as Headless from '@headlessui/react'
import React, { useState, useRef, useEffect, Fragment, ReactElement } from "react";
import { Dropdown, DropdownMenu, DropdownItem, DropdownShortcut, DropdownLabel, DropdownButton } from "@/components/catalyst-ui/dropdown";
import { Menu, MenuButton } from "@headlessui/react";
import { SimpleVocabTerm } from "@/db/models/vocab-term";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/catalyst-ui/table";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import AnnotatedExcerptModel, { AnnotatedExcerpt, MongoAnnotatedExcerpt } from "@/db/models/reading/excerpt";
import { TextWithActions } from "@/components/TextWithActions";
import { getExerptAction, removeTermFromAnnotatedExcerpt, updateDocumentById, updateTermFromAnnotatedExcerptAction, updateTermToAnnotatedExcertAction } from "@/db/actions";
import { reverso, toTermTuple, TranslationResponse } from "@/clients/reverso";
import { Language, Term, TermTuple } from "@/db/types";
import { MongoTermTuple } from "@/db/models/TermTupleSchema";
import { Listbox, ListboxLabel, ListboxOption } from "@/components/catalyst-ui/listbox";
import { Description, Field, Label } from "@/components/catalyst-ui/fieldset";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "@/components/catalyst-ui/dialog";
import { DescriptionList, DescriptionTerm, DescriptionDetails } from "@/components/catalyst-ui/description-list";
import { Button } from "@/components/catalyst-ui/button";
import { handleKeyDown } from "@/app/utils";
import { SaveableTextArea } from "../../../components/SaveableTextArea";
import { EditablePageHeader } from "../../../components/EditablePageHeader";
import { TermTupleRows } from "@/components/term-tuple-manager/TermTupleRow";

export default function ReadingTool({ params }: { params: Promise<{ excerptId: string }> }) {
    const [excerpt, setExcerpt] = useState<MongoAnnotatedExcerpt>();
    const [excerptId, setExcerptId] = useState<string>();
   
    useEffect(() => { // Load Excerpt by Id
        params.then(params => {
            console.log("Loading Excerpt: ", params.excerptId)
            setExcerptId(params.excerptId)
            return getExerptAction(params.excerptId)
        })
            .then(JSON.parse).then((excerpt: MongoAnnotatedExcerpt) => setExcerpt(excerpt))
    }, [])
    const saveNewTerm = (selectedText: string, excerptId: string) => {
        // navigator.clipboard.writeText(selectedText);
        // alert("Text copied!");
        // return new Promise(() => { });
        return reverso(selectedText, "fr", "en")
            .then(response => toTermTuple(selectedText, response)).then(term => updateTermToAnnotatedExcertAction(term, excerptId))
            .then(JSON.parse)
            .then(updatedExcerpt => setExcerpt(updatedExcerpt))
            .catch(error => console.error(error))
    };

    function updateContent(newContent: string, excerptId: string): Promise<void> {
        return updateDocumentById<MongoAnnotatedExcerpt>("AnnotatedExcerpt", excerptId, { ...excerpt, content: newContent })
            .then(JSON.parse)
            .then(setExcerpt)
    }

    function updateTitle(newTitle: string, excerptId: string): Promise<void> {
        return updateDocumentById<MongoAnnotatedExcerpt>("AnnotatedExcerpt", excerptId, { ...excerpt, title: newTitle })
            .then(JSON.parse)
            .then(setExcerpt)
    }

    // Example placeholder function for translation
    const translateText = (selectedText: string) => {
        return reverso(selectedText, "fr", "en").then((res: TranslationResponse) => alert(`${selectedText} -> ${res.translation[0]}`))
    };
    if (!excerpt) {
        return <div>Loading ...</div>
    }
    return (
        <>
            <EditablePageHeader title={excerpt.title} saveTitle={(newTitle: string) => updateTitle(newTitle, excerpt._id)}>
                <>
                    <TextWithActions
                        highlightActions={
                            (selectedText: string, closeMenu: () => void) => (
                                <>
                                    <DropdownItem onClick={() => saveNewTerm(selectedText, excerpt._id).then(closeMenu)}>
                                        <DropdownShortcut keys="⌘S" />
                                        <DropdownLabel>Save</DropdownLabel>
                                    </DropdownItem>
                                    <DropdownItem onClick={() => translateText(selectedText).then(closeMenu)}>
                                        <DropdownLabel>Quick Translate</DropdownLabel>
                                        <DropdownShortcut keys="⌘T" />
                                    </DropdownItem>
                                    <DropdownItem onClick={() => translateText(selectedText).then(closeMenu)}>
                                        <DropdownLabel>Speak</DropdownLabel>
                                        {/* <DropdownShortcut keys="⌘T" /> */}
                                    </DropdownItem>
                                </>)
                        }
                        body={
                            <SaveableTextArea
                                text={excerpt.content}
                                saveText={(newContent: string) => updateContent(newContent, excerpt._id)}
                            />
                        }
                    />
                </>
            </EditablePageHeader>
            {/* <div className="fixed rounded bottom-0 w-auto h-1/3 p-4 overflow-x-hidden overflow-y-scroll bg-gray-800 shadow-lg z-100"> */}
            <SavedTerms excerpt={excerpt} setExcerpt={setExcerpt} />
            {/* </div> */}
        </>
    )
        
}

function SavedTerms({ excerpt, setExcerpt }: { excerpt: MongoAnnotatedExcerpt, setExcerpt: (x: MongoAnnotatedExcerpt) => void }) {
    function removeItem(term: TermTuple) {
        removeTermFromAnnotatedExcerpt(term, excerpt._id).then(res => JSON.parse(res)).then((updated: MongoAnnotatedExcerpt) => setExcerpt(updated))
    }

    function editItem(newTermTuple: TermTuple, oldTermTuple: TermTuple): void {
        console.log("HIT")
        updateTermFromAnnotatedExcerptAction(newTermTuple, oldTermTuple, excerpt._id).then(JSON.parse).then((updated: MongoAnnotatedExcerpt) => setExcerpt(updated))
    }

    return <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
        <TableHead>
            <TableRow>
                <TableHeader>French</TableHeader>
                <TableHeader>English</TableHeader>
                <TableHeader>Actions</TableHeader>
            </TableRow>
        </TableHead>
        <TableBody>
            {excerpt.terms.length ? (<TermTupleRows
                terms={excerpt.terms}
                removeAction={removeItem}
                editAction={editItem}
            />) : "No terms have been saved"}
        </TableBody>
    </Table>
}








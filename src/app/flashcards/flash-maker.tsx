import { createFlashCardAction } from '@/db/actions'
import { Button } from '../../components/catalyst-ui/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../../components/catalyst-ui/dialog'
import { Field, Label } from '../../components/catalyst-ui/fieldset'
import { Input } from '../../components/catalyst-ui/input'
import { useState } from 'react'
import { SimpleVocabTerm } from "@/db/models/vocab-term"
import { foodTermTuples } from '@/test-data/term-tuples'

export default function FlashCardMaker({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (x: boolean) => void}) {
  const [quickTerm, setQuickTerm] = useState<SimpleVocabTerm>({french: "", english:"", misc:""})
  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        New
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Make a new Flash Card</DialogTitle>
        <DialogDescription>
          
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>French Term</Label>
            <Input value={quickTerm.french} onChange={(event) => setQuickTerm(term => ({...term, french: event.target.value}))} name="text" placeholder="" autoFocus />
          </Field>
          <Field>
            <Label>Translation</Label>
            <Input value={quickTerm.english} onChange={(event) => setQuickTerm(term => ({...term, english: event.target.value}))} name="text" placeholder=""  />
          </Field>
          <Field>
            <Label>Example sentence</Label>
            <Input value={quickTerm.misc} onChange={(event) => setQuickTerm(term => ({...term, misc: event.target.value}))} name="text" placeholder=""  />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Create</Button>
          <Button onClick={() => createFlashCardAction(quickTerm).then(r => console.log(r)).catch(e => console.error(e))}>KITTEN</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
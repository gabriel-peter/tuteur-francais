import { Button } from '../../components/catalyst-ui/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '../../components/catalyst-ui/dialog'
import { Field, Label } from '../../components/catalyst-ui/fieldset'
import { Input } from '../../components/catalyst-ui/input'
import { useState } from 'react'

export default function FlashCardMaker() {
  let [isOpen, setIsOpen] = useState(false)

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
            <Input name="text" placeholder="" autoFocus />
          </Field>
          <Field>
            <Label>Translation</Label>
            <Input name="text" placeholder=""  />
          </Field>
          <Field>
            <Label>Example sentence</Label>
            <Input name="text" placeholder=""  />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
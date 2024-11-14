"use client";
import { handleKeyDown } from "@/app/utils";
import { Input, InputGroup } from "@/components/catalyst-ui/input";
import { LoadingButton } from "@/components/LoadingButton";
import { Field, Description } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

export function SearchBar({ textValue, setTextValue, searchAction, description }: { textValue: string | undefined; setTextValue: (x: string) => void; searchAction: () => Promise<any>; description?: string}) {
    return  (<Field>
                {description && <Description>{description}</Description>}
                <InputGroup>
                    <MagnifyingGlassIcon />
                    <Input
                        type="url"
                        name="url"
                        placeholder="Search&hellip;"
                        aria-label="Search"
                        value={textValue}
                        onChange={e => setTextValue(e.currentTarget.value)}
                        onKeyDown={(event) => handleKeyDown(event, searchAction)}
                        autoFocus
                    />
                </InputGroup>
                </Field>)
}

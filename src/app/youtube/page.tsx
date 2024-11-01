"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, InputGroup } from "../catalyst-ui/input";
import PageHeader from "../components/page-header";
import { Description, Field, Label } from "../catalyst-ui/fieldset";
import { useState } from "react";
import { Button } from "../catalyst-ui/button";

function extractYoutubeId(url: string): string | undefined {
    const regex = /[?&]v=([^&#]*)/;
    const match = url.match(regex);

    if (match) {
        const videoId = match[1];
        console.log(videoId); // Output: 4vhBcNeYOcg
        return videoId
    }
}



export default function YoutubeTool() {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setUrl(event.currentTarget.value);
        }
    }
    const [url, setUrl] = useState<string>();
    return (
        <PageHeader title="Youtube Tool">
            <Field>
                {/* <Label>Your website</Label> */}
                <Description>Enter a video URL that you wish to take notes on.</Description>
                <InputGroup>

                    <MagnifyingGlassIcon />
                    <Input
                     type="url"
                      name="url" 
                      placeholder="Search&hellip;" 
                      aria-label="Search" 
                      value={url} 
                      onKeyDown={handleKeyDown}
                      autoFocus 
                      />
                </InputGroup>
            </Field>
            <br/>
            <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }} >
            {url && <iframe
                title='Youtube player'
                className="absolute top-0 left-0 w-full h-full"
                sandbox='allow-same-origin allow-forms allow-popups allow-scripts allow-presentation'
                src={`https://youtube.com/embed/${extractYoutubeId(url)}?autoplay=0`}
                style={{ border: 'none' }} // Optional: to remove the default border
                >
            </iframe> }
            </div>
        </PageHeader>
    )
}
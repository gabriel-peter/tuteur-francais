"use client"
import { Button } from "@/components/catalyst-ui/button";
import { createAnnotatedExcerptAction, getAllExerptsAction } from "@/db/actions";
import { AnnotatedExcerpt, MongoAnnotatedExcerpt } from "@/db/models/excerpt";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RecentAnnotations from "./RecentAnnotations";

const testAnnotatedExcerpt = {title: "Test", content: "Qui sera le prochain occupant de la Maison Blanche ? Outre-Atlantique, cette question que les électeurs américains s’apprêtent à trancher intéresse également les décideurs, qui craignent les potentielles répercussions de cette élection présidentielle américaine très attendue, prévue ce mardi. Les dossiers qui attendent le futur président - allant de la guerre en Ukraine à la lutte contre le réchauffement climatique, en passant par la politique économique - seront scrutés de près. ", terms: [], createdAt: new Date()}
export default function Recents() {
    const [excerpts, setExcerpts] = useState<MongoAnnotatedExcerpt[]>([]);
    const router = useRouter()
    useEffect(() => {
        getAllExerptsAction().then(r => JSON.parse(r)).then((excerpts: MongoAnnotatedExcerpt[]) => setExcerpts(excerpts))
    }, [])
    function createNewAnnotatedExcerpt() {
        createAnnotatedExcerptAction(testAnnotatedExcerpt)
        // .then(res => JSON.parse(res)).then((excerpt: MongoAnnotatedExcerpt) => excerpt.id)
        .then(excerptId => router.push(`/news/${excerptId}`))
        .catch(error => console.error(error))
    }
    return (
        <>
    <Button onClick={() => createNewAnnotatedExcerpt()}>New</Button>
    <RecentAnnotations excerpts={excerpts}/>
    </>
)
}
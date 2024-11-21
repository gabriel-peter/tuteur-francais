"use client"
import { Button } from "@/components/catalyst-ui/button";
import { createAnnotatedExcerptAction, getAllExerptsAction } from "@/db/actions";
import { AnnotatedExcerpt, MongoAnnotatedExcerpt } from "@/db/models/excerpt";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RecentAnnotations from "./RecentAnnotations";
import PageHeader from "@/components/PageHeader";

const emptyAnnotatedExcerpt = { title: "Untitled", content: "", terms: [], createdAt: new Date() }
export default function Recents() {
    const [excerpts, setExcerpts] = useState<MongoAnnotatedExcerpt[]>([]);
    const router = useRouter()
    useEffect(() => {
        getAllExerptsAction().then(r => JSON.parse(r)).then((excerpts: MongoAnnotatedExcerpt[]) => setExcerpts(excerpts))
    }, [])
    function createNewAnnotatedExcerpt() {
        createAnnotatedExcerptAction(emptyAnnotatedExcerpt)
            // .then(res => JSON.parse(res)).then((excerpt: MongoAnnotatedExcerpt) => excerpt.id)
            .then(excerptId => router.push(`/reading/${excerptId}`))
            .catch(error => console.error(error))
    }
    return (
        <PageHeader title="Readings" buttonSuite={[<Button onClick={() => createNewAnnotatedExcerpt()}>New</Button>]}>
            <RecentAnnotations excerpts={excerpts} />
        </PageHeader>
    )
}
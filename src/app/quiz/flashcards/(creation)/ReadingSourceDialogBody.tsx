"use client";
import { getAllAnnotatedExcerptAction, createQuizAction } from "@/db/actions";
import { Quiz } from "@/db/types";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ExternalSourceSelector } from "./ExternalSourceSelector.1";
import { AnnotatedExcerpt } from "@/db/models/reading/excerpt";
import { QuizPartial } from "./TermTuplePreview";

// Copy of VideoSourceDialogBody TODO abstract
export function ReadingSourceDialogBody() {
    const [recentExcerpts, setRecentExcerpts] = useState<AnnotatedExcerpt[]>();
    const [selectedExcerptIndex, setSelectedExcerptIndex] = useState<number>();
    useEffect(() => {
        getAllAnnotatedExcerptAction().then(JSON.parse).then(recentExcerpts => setRecentExcerpts(recentExcerpts)); // TODO LIMIT
    }, []);

    function createQuiz(excerpt: QuizPartial) {
        const newQuiz: Quiz = {
            title: excerpt.title,
            items: excerpt.terms,
            state: "NEW"
        };
        return createQuizAction(newQuiz); // TODO this fails but still makes the quiz
    }

    return (
        <ExternalSourceSelector
            label="Recent Excerpts"
            recents={recentExcerpts}
            selectedIndex={selectedExcerptIndex}
            setSelectedIndex={setSelectedExcerptIndex}
            createQuiz={createQuiz}
        />);

}

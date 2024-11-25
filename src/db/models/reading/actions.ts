"use server"

import dbConnect from "@/db/mongoose";
import AnnotatedExcerptModel, { AnnotatedExcerpt } from "./excerpt";

export async function deleteExcerpt(_id: string): Promise<string | null> {
    await dbConnect();
    console.warn("DELETING", _id)
    return await AnnotatedExcerptModel.findOneAndDelete({_id}).then(JSON.stringify)
}
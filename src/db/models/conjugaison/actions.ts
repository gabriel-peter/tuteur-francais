"use server"
import dbConnect from "@/db/mongoose";
import  ConjugaisonItemSchemaModel, { ConjugaisonTerm } from "./conjugaison";

export async function createConjugaisonTerm(conjugaisonTerm: ConjugaisonTerm) {
    
    return ConjugaisonItemSchemaModel.create(conjugaisonTerm).then(JSON.stringify)
}

export async function findConjugaisonTerm(word: string) {
    await dbConnect();
    const optionalTerm = await ConjugaisonItemSchemaModel.findOne({word}).lean()
    if (optionalTerm) {
        console.log("Term already found", optionalTerm)
        return JSON.stringify(optionalTerm)
    }
    return null
}
"use server"
import { VideoVocabTerm } from "@/data/types";
import dbConnect from "./mongoose";
import SimpleVocabTerm from "@/db/models/vocab-term"

// async function main() {
// const client = 
// }

// TODO use interfaces?
// import mongoose, { Document, Schema, model } from "mongoose";

// // 1. Define the TypeScript interface
// interface User extends Document {
//   name: string;
//   email: string;
//   age?: number; // Optional field
// }

// // 2. Define the Mongoose schema based on the TypeScript interface
// const UserSchema = new Schema<User>({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   age: { type: Number, required: false },
// });

// // 3. Create a model that uses the TypeScript type and the Mongoose schema
// const UserModel = model<User>("User", UserSchema);

// // Example usage with TypeScript type inference
// const createUser = async () => {
//   const user = new UserModel({ name: "John Doe", email: "john@example.com" });
//   await user.save();
// };

export async function createFlashCardAction(term: VideoVocabTerm) {
    await dbConnect();
    const newTerm = await SimpleVocabTerm.create(term)
    return JSON.stringify(newTerm.id);
}

export async function getFlashCardAction(term: VideoVocabTerm) {
    await dbConnect();
    const newTerm = SimpleVocabTerm.create(term)
    return JSON.stringify(newTerm);
}
"use client"

export default async function YoutubeNoteTaker({ params }: { params: Promise<{ videoId: string }> }) {
    return <div>{(await params).videoId}</div>
}
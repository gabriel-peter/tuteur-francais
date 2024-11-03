import PageHeader from "@/components/page-header";

export default function YoutubeToolLayout({children}: {children: React.ReactNode}) {
    return (
        <PageHeader title="Youtube Tool">
        {children}
        </PageHeader>
    )
}
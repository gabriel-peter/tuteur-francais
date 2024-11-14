import PageHeader from "@/components/PageHeader";

export default function YoutubeToolLayout({ children }: { children: React.ReactNode }) {
    return (
        <PageHeader title="Youtube Tool">
            {children}
        </PageHeader>
    )
}
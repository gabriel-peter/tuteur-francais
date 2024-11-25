import { Divider } from "./catalyst-ui/divider";
import { Heading } from "./catalyst-ui/heading";


export default function PageHeader({ title, buttonSuite, children }: { title: string; buttonSuite?: React.ReactElement[]; children: React.ReactNode; }) {
    return (
        <div>
            <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
                <Heading>{title}</Heading>
                {buttonSuite?.map((button, index) => <div className="flex gap-4" key={index}>
                    {button}
                </div>)}
            </div>
            <Divider />
            <div
            >
                {children}
            </div>
        </div>
    );
}

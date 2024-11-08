"use client"
import { Navbar, NavbarSection, NavbarItem } from "@/components/catalyst-ui/navbar";
import PageHeader from "@/components/page-header";
import { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function QuizLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // Update the path whenever the route changes
    useEffect(() => {

    }, [pathname]); // Depend on `router.asPath` to trigger on route change


    const navItems: { name: string, href: Route }[] = [
        { name: "Conjugaison", href: "/quiz/conjugaison" },
        { name: "Dialog", href: "/quiz/dialog" },
        { name: "Tests", href: "/quiz/tests" },
        { name: "Flashcards", href: "/quiz/flashcards" },
    ]

    return (
        <PageHeader title={"QUIZ"} buttonSuite={[<Navbar>
            <NavbarSection>
                {navItems.map(navItem =>
                    <NavbarItem current={pathname === navItem.href} href={navItem.href}>
                        {navItem.name}
                    </NavbarItem>
                )}
            </NavbarSection>
        </Navbar>]}>
            {children}
        </PageHeader>
    )
}
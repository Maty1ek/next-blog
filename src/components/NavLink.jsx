'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function NavLink({label, href}) {
    const pathName = usePathname()
    return (
        <Link className={`nav-link ${pathName === href && "nav-link-active"}`} href={href}>
            {label}
        </Link>
    )
}

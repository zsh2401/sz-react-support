import React, { HTMLAttributes, ReactNode } from 'react'
export interface IStdProps
    extends React.DetailedHTMLProps<HTMLAttributes<HTMLDivElement>,
        HTMLDivElement> {
}
export type OnlyChildrenProps = ChildrenProps
export interface ChildrenProps {
    children: ReactNode
}
import styled from '@emotion/styled';
import React, { ElementType, ReactNode } from 'react';

const ColumnBox = styled.div`
    display: ${({ hidden }) => (hidden ? 'none' : 'block')};
    width: 100%;
    column-count: 2;
    column-gap: 1rem;
    column-fill: balance;

    @media (max-width: 1400px) {
        column-count: 1;
    }
`;

interface TabPanelProps<T extends ElementType = 'div'>
    extends React.ComponentPropsWithRef<'div'> {
    children: ReactNode;
    index: number;
    currentIndex: number;
    component?: T;
    componentProps?: React.ComponentProps<T>;
}

export function TabPanel<T extends ElementType = 'div'>({
    children,
    currentIndex,
    index,
    component: Component,
    componentProps,
    ...rest
}: TabPanelProps<T>) {
    return (
        <ColumnBox
            as={Component}
            {...componentProps}
            role="tabpanel"
            hidden={currentIndex !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...rest}
        >
            {currentIndex === index && children}
        </ColumnBox>
    );
}

import React, { ReactNode, ElementType, forwardRef } from 'react';
import styled from '@emotion/styled';
import { Typography } from '@mui/material';

export const ItemContainer = styled.div`
    break-inside: avoid;
    margin-bottom: 1rem;
    padding: 1rem;
`;

interface TabPanelItemProps<T extends ElementType = 'div'>
    extends React.ComponentPropsWithRef<'div'> {
    label?: string;
    children: ReactNode;
    component?: T;
    componentProps?: React.ComponentProps<T>;
}

export const TabPanelItem = forwardRef(function TabPanelItem<
    T extends ElementType = 'div',
>(
    {
        label,
        children,
        component: Component,
        componentProps,
        ...rest
    }: TabPanelItemProps<T>,
    ref: React.Ref<HTMLDivElement>,
) {
    return (
        <ItemContainer ref={ref} as={Component} {...componentProps} {...rest}>
            {label && (
                <Typography variant="h6" align="left" gutterBottom>
                    {label}
                </Typography>
            )}
            {children}
        </ItemContainer>
    );
});

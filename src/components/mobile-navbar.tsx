import React from 'react';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { characterDisplayTabs } from './character-display/character-display-tabs';
import { useCharacterDisplayTab } from '../context/character-display-tab-context/character-display-tab-context';

type ThemeProps = { theme?: Theme };

const NavBox = styled(Box)<ThemeProps>`
    display: flex;
    align-items: center;
    width: 100vw;
    background-color: ${({ theme }) => theme.palette.background.paper};
    box-shadow: ${({ theme }) => theme.shadows[6]};
    border-top: 1px solid ${({ theme }) => theme.palette.divider};
    z-index: ${({ theme }) => theme.zIndex.appBar};
`;

const NavbarButton = styled.button<ThemeProps & { isActive: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex: 1;
    height: 64px;
    background-color: ${({ theme, isActive }) =>
        isActive ? theme.palette.action.selected : 'transparent'};
    color: ${({ theme }) => theme.palette.text.primary};
    border: none;
    outline: none;
    padding: ${({ theme }) => theme.spacing(1)};
    &:hover {
        background-color: ${({ theme }) => theme.palette.action.hover};
    }
`;

export function MobileNavbar() {
    const { tabIndex, setTabIndex } = useCharacterDisplayTab();

    return (
        <NavBox>
            {characterDisplayTabs.map(({ label, labelMobile, icon }, index) => (
                <NavbarButton
                    key={label}
                    isActive={index === tabIndex}
                    onClick={() => setTabIndex(index)}
                >
                    {icon}
                    <Typography variant="caption">
                        {labelMobile ?? label}
                    </Typography>
                </NavbarButton>
            ))}
        </NavBox>
    );
}

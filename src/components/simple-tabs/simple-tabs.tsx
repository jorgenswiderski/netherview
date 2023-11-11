import { Box, Tabs, Tab } from '@mui/material';
import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { TabPanelProps } from './types';
import { useResponsive } from '../../hooks/use-responsive';
import { useCharacterDisplayTab } from '../../context/character-display-tab-context/character-display-tab-context';

const TabsBox = styled(Box)`
    display: flex;
    flex-direction: column;

    flex: 1;

    width: 100%;
    overflow: hidden;
`;

const PanelScrollBox = styled(Box)`
    flex: 1;

    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    @media (max-width: 768px) {
        overflow-y: hidden;
    }
`;

interface SimpleTabsProps {
    tabs: {
        label: string;
        labelMobile?: string;
        icon?: ReactNode;
        element: (props: TabPanelProps) => React.JSX.Element;
    }[];
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function SimpleTabs({ tabs }: SimpleTabsProps) {
    const { isMobile } = useResponsive();
    const { tabIndex, setTabIndex } = useCharacterDisplayTab();

    return (
        <TabsBox>
            {!isMobile && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabIndex}
                        onChange={(event, index) => setTabIndex(index)}
                    >
                        {tabs.map(({ label }, index) => (
                            <Tab
                                label={label}
                                key={label}
                                {...a11yProps(index)}
                            />
                        ))}
                    </Tabs>
                </Box>
            )}

            <PanelScrollBox>
                {tabs.map((t, index) => (
                    <t.element
                        index={index}
                        key={t.label}
                        currentIndex={tabIndex}
                    />
                ))}
            </PanelScrollBox>
        </TabsBox>
    );
}

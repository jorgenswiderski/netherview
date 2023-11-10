import { Box, Tabs, Tab } from '@mui/material';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { TabPanelProps } from './types';
import { useResponsive } from '../../hooks/use-responsive';

const TabsBox = styled(Box)`
    display: flex;
    flex-direction: column;

    flex: 1;

    width: 100%;
    overflow: hidden;
`;

const PanelScrollBox = styled(Box)`
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
`;

interface SimpleTabsProps {
    tabs: {
        label: string;
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
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <TabsBox>
            {!isMobile && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={currentIndex}
                        onChange={(event, index) => setCurrentIndex(index)}
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

            {isMobile && null /* TODO: navbar */}

            <PanelScrollBox>
                {tabs.map((t, index) => (
                    <t.element
                        index={index}
                        key={t.label}
                        currentIndex={currentIndex}
                    />
                ))}
            </PanelScrollBox>
        </TabsBox>
    );
}

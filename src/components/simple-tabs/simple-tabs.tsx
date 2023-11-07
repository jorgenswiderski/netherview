import { Box, Tabs, Tab } from '@mui/material';
import React, { useState } from 'react';
import { TabPanelProps } from './types';
import { useResponsive } from '../../hooks/use-responsive';

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
        <Box sx={{ width: '100%' }}>
            {!isMobile && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={currentIndex}
                        onChange={(event, index) => setCurrentIndex(index)}
                    >
                        {tabs.map(({ label }, index) => (
                            <Tab label={label} {...a11yProps(index)} />
                        ))}
                    </Tabs>
                </Box>
            )}

            {isMobile && null /* TODO: navbar */}

            {tabs.map((t, index) => (
                <t.element index={index} currentIndex={currentIndex} />
            ))}
        </Box>
    );
}

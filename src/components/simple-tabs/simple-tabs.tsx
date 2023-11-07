import { Box, Tabs, Tab } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { TabPanelProps } from './types';

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
    const [currentIndex, setCurrentIndex] = useState(0);

    const tab = useMemo(() => tabs[currentIndex], [currentIndex]);

    return (
        <Box sx={{ width: '100%' }}>
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

            <tab.element index={currentIndex} currentIndex={currentIndex} />
        </Box>
    );
}

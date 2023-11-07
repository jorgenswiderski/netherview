import React from 'react';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    currentIndex: number;
}

export function TabPanel(props: TabPanelProps) {
    const { children, currentIndex, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={currentIndex !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {currentIndex === index && children}
        </div>
    );
}

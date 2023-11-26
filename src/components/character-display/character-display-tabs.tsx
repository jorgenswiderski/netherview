import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShieldIcon from '@mui/icons-material/Shield';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import FlareIcon from '@mui/icons-material/Flare';
import BoltIcon from '@mui/icons-material/Bolt';
import { PassivesTab } from './tabs/passives/passives-tab';
import { EquipmentTab } from './tabs/equipment/equipment-tab';
import { ProgressionTab } from './tabs/progression/progression-tab';
import { OverviewTab } from './tabs/overview/overview-tab';
import { ActionsTab } from './tabs/actions/actions-tab';

export const characterDisplayTabs = [
    {
        label: 'Overview',
        labelMobile: 'Summary',
        element: OverviewTab,
        icon: <DashboardIcon />,
    },
    {
        label: 'Progression',
        labelMobile: 'Levels',
        element: ProgressionTab,
        icon: <AutoGraphIcon />,
    },
    {
        label: 'Actions',
        element: ActionsTab,
        icon: <BoltIcon />,
    },
    {
        label: 'Equipment',
        labelMobile: 'Items',
        element: EquipmentTab,
        icon: <ShieldIcon />,
    },
    {
        label: 'Passives',
        element: PassivesTab,
        icon: <FlareIcon />,
    },
];

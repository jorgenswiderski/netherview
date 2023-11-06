import React, {
    useContext,
    useEffect,
    useState,
    useMemo,
    ReactNode,
} from 'react';
import { ISpell } from '@jorgenswiderski/tomekeeper-shared/dist/types/action';
import { Alert, Box, Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { GameDataContext, GameDataContextType } from './types';
import { WeaveApi } from '../../api/weave/weave';
import { CharacterClassOption } from '../../models/character/types';
import { error } from '../../models/logger';

const FullPageBox = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
`;

const StyledAlert = styled(Alert)`
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    .MuiAlert-message {
        width: 100%;
    }
`;

function FullPageError() {
    return (
        <FullPageBox>
            <StyledAlert severity="error">
                <Typography variant="h5" gutterBottom>
                    Fatal Error
                </Typography>
                <Typography variant="body1" gutterBottom>
                    There was a problem fetching game data. Please refresh the
                    page or try again later.
                </Typography>
                <Button
                    color="inherit"
                    onClick={() => window.location.reload()}
                >
                    Refresh
                </Button>
            </StyledAlert>
        </FullPageBox>
    );
}

interface GameDataProviderProps {
    children: ReactNode;
}

export function GameDataProvider({ children }: GameDataProviderProps) {
    const [classData, setClassData] = useState<CharacterClassOption[]>();
    const [spellData, setSpellData] = useState<ISpell[]>();
    const [showError, setShowError] = useState<boolean>(false);

    useEffect(() => {
        Promise.all([
            WeaveApi.classes.getClassesInfo().then(setClassData),
            WeaveApi.spells.get().then(setSpellData),
        ]).catch((err) => {
            error(err);
            setShowError(true);
        });
    }, []);

    const contextValue = useMemo(
        () => ({ classData, spellData }),
        [classData, spellData],
    );

    if (showError) {
        return <FullPageError />;
    }

    return (
        <GameDataContext.Provider value={contextValue}>
            {children}
        </GameDataContext.Provider>
    );
}

export const useGameData = (): GameDataContextType => {
    const context = useContext(GameDataContext);

    if (context === undefined) {
        throw new Error('useGameData must be used within a GameDataProvider');
    }

    return context;
};

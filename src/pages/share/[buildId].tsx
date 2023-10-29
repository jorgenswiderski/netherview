import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';
import styled from '@emotion/styled';
// import { keyframes } from '@emotion/react';
import { Utils } from '../../models/utils';
import { WeaveApi } from '../../api/weave/weave';
import { error } from '../../models/logger';
import { useCharacter } from '../../context/character-context/character-context';
import { Character } from '../../models/character/character';
import { useGameData } from '../../context/game-data-context/game-data-context';

// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//   }
//   to {
//     opacity: 1;
//   }
// `;

const CenteredBox = styled(Box)`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
`;

// const LoadingText = styled(Typography)`
//     margin-top: 16px;
//     animation: ${fadeIn} 1s ease-in-out;
//     animation-delay: 250ms;
//     animation-fill-mode: both;
// `;

export default function BuildPage() {
    const router = useRouter();
    const { setBuild, setCharacter } = useCharacter();
    const { spellData, classData } = useGameData();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    function onError(message: string) {
        setErrorMessage(message);
        setIsLoading(false);
        setTimeout(() => router.push('/'), 5000);
    }

    useEffect(() => {
        const { buildId } = router.query as { buildId: string };

        if (!buildId) {
            return;
        }

        async function fetchImportStr(): Promise<void> {
            try {
                const build = await WeaveApi.builds.get(buildId);
                setBuild(build);

                const character = await Character.import(
                    build.encoded,
                    classData!,
                    spellData!,
                );

                setCharacter(character);
                router.push('/', `/share/${buildId}`, { shallow: true });
            } catch (err) {
                error(err);
                onError('Could not find the specified build.');
                setIsLoading(false);
                setTimeout(() => router.push('/'), 5000);
            }
        }

        if (Utils.isUuid(buildId)) {
            if (classData && spellData) {
                fetchImportStr();
            }
        } else {
            setErrorMessage(
                "That doesn't seem to be a valid build id. Please check the URL and try again.",
            );

            setIsLoading(false);
            setTimeout(() => router.push('/'), 5000);
        }
    }, [setBuild, router, classData, spellData]);

    return (
        <CenteredBox>
            {isLoading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {errorMessage && (
                <Typography variant="body1" color="error">
                    {errorMessage}
                </Typography>
            )}
        </CenteredBox>
    );
}

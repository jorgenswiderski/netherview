import React, { useEffect, useState } from 'react';
import { ISpell } from 'planner-types/src/types/action';
import { BeatLoader } from 'react-spinners';
import { Character } from '../../models/character/character';
import { CharacterClassOption } from '../../models/character/types';
import { error } from '../../models/logger';
import CharacterPlanner from './character-planner';

interface CharacterPlannerLoaderProps {
    classData: CharacterClassOption[];
    spellData: ISpell[];
    importStr?: string;
}

export function CharacterPlannerLoader({
    importStr,
    classData,
    spellData,
}: CharacterPlannerLoaderProps) {
    // const router = useRouter();
    const [importString, setImportString] = useState<string | null>(
        () => importStr ?? null,
    );

    const [character, setCharacter] = useState<Character | null>(() =>
        importString ? null : new Character(classData, spellData),
    );

    useEffect(() => {
        async function loadCharacter(s: string): Promise<void> {
            const char = await Character.import(s, classData, spellData);
            setCharacter(char);
            // router.replace({ pathname: '/' });
            setImportString(null);
        }

        if (importString) {
            loadCharacter(importString).catch(error);
        }
    }, [importString]);

    if (!character) {
        return <BeatLoader />;
    }

    return <CharacterPlanner character={character} />;
}

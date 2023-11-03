import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSettings } from '../context/user-settings-context/user-settings-context';

export default function DebugPage() {
    const router = useRouter();
    const { updateSettingsState } = useSettings();

    useEffect(() => {
        localStorage.setItem('debugMode', 'true');
        updateSettingsState();
        router.push('/');
    }, []);
}

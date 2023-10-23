import React from 'react';
import { useRouter } from 'next/router';
import HomePage from '..';

export default function Page() {
    const router = useRouter();
    const { id } = router.query;

    return <HomePage importStr={id as string} />;
}

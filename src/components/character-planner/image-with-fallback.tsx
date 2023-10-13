import React, { cloneElement, useEffect, useState } from 'react';

interface ImageWithFallbackProps {
    src: string; // Original source
    fallback?: string | JSX.Element; // Image path or JSX element to display in case of error
    placeholder?: string | JSX.Element; // Image path or JSX element to display while the original image is loading
    alt: string;
    className?: string;
    style?: React.CSSProperties;
    inheritStyle?: boolean;
    // Add any other img props if necessary
}

export default function ImageWithFallback({
    src,
    fallback,
    placeholder,
    alt,
    inheritStyle = true,
    ...props
}: ImageWithFallbackProps) {
    const [hasError, setHasError] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        // Use Image constructor to preload and handle events
        const image = new Image();

        // Set event handlers
        image.onload = () => {
            setIsLoaded(true);
        };

        image.onerror = () => {
            setHasError(true);
        };

        // Start the image loading process
        image.src = src;
    }, [src]);

    const renderImage = (source: string | JSX.Element) => {
        if (typeof source === 'string') {
            return <img src={source} alt={alt} {...props} />;
        }

        if (inheritStyle) {
            return cloneElement(source, props);
        }

        return source;
    };

    if (!isLoaded && placeholder) {
        return renderImage(placeholder);
    }

    if (hasError && fallback) {
        return renderImage(fallback);
    }

    return <img src={src} alt={alt} {...props} />;
}

// base-tooltip.tsx
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import { Box, ClickAwayListener, Tooltip, TooltipProps } from '@mui/material';
import styled from '@emotion/styled';
import { darken } from '@mui/system';
import { WeaveImages } from '../../api/weave/weave-images';
import { useResponsive } from '../../hooks/use-responsive';

const MainBox = styled(Box)`
    position: relative;
`;

const Section = styled(Box)`
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
`;

const HeaderBox = styled(Section)`
    align-items: stretch;
`;

const BodyBox = styled(Section)`
    gap: 0.25rem;
    // background: rgb(16, 12, 9);
`;

const QuoteBox = styled(Section)`
    background: ${darken('#333', 0.1)};
    opacity: 0.6;
    gap: 0.5rem;
`;

const FooterBox = styled(Section)`
    flex-direction: row;
    align-items: center;
    gap: 1rem;

    background: ${darken('#333', 0.3)};
`;

const Icon = styled('img')`
    position: absolute;
    top: -5%;
    right: -5%;
    opacity: 0.7;
    width: 120px;
    height: 120px;
`;

interface BaseTooltipProps extends Omit<TooltipProps, 'title'> {
    header?: ReactNode;
    body?: ReactNode;
    quote?: ReactNode;
    footer?: ReactNode;
    image?: string;
    name: string;
    children: ReactElement;
    touchBehavior?: 'tap' | 'longPress' /* | 'modal' */ | 'none';
}

export function BaseTooltip({
    header,
    body,
    quote,
    footer,
    image,
    name,
    children,
    touchBehavior = 'tap',
    ...props
}: BaseTooltipProps) {
    const { isTouch } = useResponsive();

    // eslint-disable-next-line no-param-reassign
    touchBehavior = isTouch ? touchBehavior : 'none';

    const [open, setOpen] = useState(false);

    const [longPressActive, setLongPressActive] =
        useState<NodeJS.Timeout | null>();

    const longPressDelay = 300; // ms

    const handleTooltipClose = () => setOpen(false);
    const handleTooltipOpen = () => setOpen(true);
    const handleTap = () => touchBehavior === 'tap' && handleTooltipOpen();

    const handleLongPressStart = () => {
        setLongPressActive(
            setTimeout(() => {
                setLongPressActive(null);
                handleTooltipOpen();
            }, longPressDelay),
        );
    };

    const handleLongPressEnd: React.TouchEventHandler<HTMLDivElement> = (
        event,
    ) => {
        // Prevent context menu from appearing
        event.preventDefault();

        if (longPressActive) {
            clearTimeout(longPressActive);
            setLongPressActive(null);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setOpen(false);
        };

        document.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, []);

    return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
                {...props}
                PopperProps={{
                    sx: {
                        '.MuiTooltip-tooltip': {
                            padding: 0,
                            borderRadius: '0.4rem',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                            overflow: 'hidden',
                            minWidth: 'min(400px, 90vw)',
                            // minHeight: '120px',
                        },
                    },
                    style: {
                        pointerEvents: 'none',
                    },
                    modifiers: [
                        {
                            name: 'flip',
                            options: {
                                fallbackPlacements: [
                                    'top',
                                    'right',
                                    'bottom',
                                    'left',
                                ],
                            },
                        },
                        {
                            name: 'preventOverflow',
                            options: {
                                altAxis: true,
                                tether: true,
                                tetherOffset: () => 20,
                                boundary: 'viewport',
                            },
                        },
                    ],
                    ...props.PopperProps,
                }}
                title={
                    <MainBox>
                        {header && <HeaderBox>{header}</HeaderBox>}
                        {body && <BodyBox>{body}</BodyBox>}
                        {quote && <QuoteBox>{quote}</QuoteBox>}
                        {footer && <FooterBox>{footer}</FooterBox>}
                        {image && (
                            <Icon
                                src={WeaveImages.getPath(image, 120)}
                                alt={name}
                            />
                        )}
                    </MainBox>
                }
                /* Mobile event handling */
                open={open}
                onClose={handleTooltipClose}
                disableFocusListener={isTouch}
                disableHoverListener={isTouch}
                disableTouchListener={isTouch}
            >
                {/* Use an inner div to allow for more custom control over the tooltip visibility state */}
                <div
                    onClick={handleTap}
                    onKeyDown={(event) => {
                        // Keyboard accessibilty
                        if (event.key === 'Enter' || event.key === ' ') {
                            handleTooltipOpen();
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => !isTouch && setOpen(true)}
                    onMouseLeave={() => !isTouch && setOpen(false)}
                    onTouchStart={
                        touchBehavior === 'longPress'
                            ? handleLongPressStart
                            : undefined
                    }
                    onTouchEnd={
                        touchBehavior === 'longPress'
                            ? handleLongPressEnd
                            : undefined
                    }
                >
                    {children}
                </div>
            </Tooltip>
        </ClickAwayListener>
    );
}

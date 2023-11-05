import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export function useResponsive() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    let isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Some desktop browsers can have a bugged state where maxTouchPoints
    // is 256, so let's assume they are not a touch device in that case
    // https://stackoverflow.com/questions/69125308/navigator-maxtouchpoints-256-on-desktop

    // Additionally, ontouchstart can get added when the desktop browser
    // enters mobile responsive mode, and doesn't get removed when it changes back
    // So let's just ignore that completely if the browser says 256 touchpoints
    if (navigator.maxTouchPoints >= 256) {
        isTouch = false;
    }

    return { isMobile, isTouch };
}

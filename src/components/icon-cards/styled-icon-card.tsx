import styled from '@emotion/styled';
import { Card } from '@mui/material';

export const StyledIconCard = styled(Card)<{ selected: boolean }>`
    aspect-ratio: 1;
    opacity: ${(props) => (props.selected ? 0.85 : 1)};
    border: 3px solid ${(props) => (props.selected ? '#3f51b5' : 'transparent')};
    width: 36px;
`;

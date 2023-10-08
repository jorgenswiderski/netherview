import styled from 'styled-components';

export const PickerCard = styled.div<{ isSelected: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background-color: #2a2a2a; // Base dark gray
    border: 2px solid
        ${({ isSelected }) => (isSelected ? '#8a8a8a' : 'transparent')}; // Light gray when selected
    cursor: pointer;
    color: #e0e0e0; // Light gray for text

    &:hover {
        background-color: #3a3a3a; // Slightly lighter gray for hover effect
    }

    img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        filter: brightness(
            0.8
        ); // Slightly dim the image to match the dark theme
    }
`;

export const PickerGrid = styled.div`
    width: 100%;
    display: grid;
    background-color: #1a1a1a; // Darker background for the grid
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
`;

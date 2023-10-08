import styled from 'styled-components';

export class Picker {
    static Card = styled.div<{ isSelected: boolean }>`
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

    static Grid = styled.div`
        width: 100%;
        display: grid;
        background-color: #1a1a1a; // Darker background for the grid
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 20px;
    `;

    static ConfirmButton = styled.button`
        margin-top: 20px;
        padding: 10px 15px;
        font-size: 1rem;
        background-color: #2d2d2d;
        color: #e0e0e0;
        border: 1px solid #555;
        transition: background-color 0.2s;

        &:hover {
            background-color: #3a3a3a;
        }

        &:disabled {
            opacity: 0.5;
        }
    `;

    static Description = styled.p`
        margin-top: 15px;
        font-size: 1.1rem;
        color: #b0b0b0;
    `;
}

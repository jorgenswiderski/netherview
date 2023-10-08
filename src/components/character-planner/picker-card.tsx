import styled from 'styled-components';

export const PickerCard = styled.div<{ isSelected: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    border: 2px solid
        ${({ isSelected }) => (isSelected ? '#999' : 'transparent')};
    cursor: pointer;

    &:hover {
        background-color: #444;
    }

    img {
        width: 80px;
        height: 80px;
        object-fit: cover;
    }
`;

export const PickerGrid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
`;

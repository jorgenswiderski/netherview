import React from 'react';

export default function HomePage() {
    // const [data, setData] = useState<CharacterClassData[]>();

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const result = await getCharacterClassList();
    //             setData(result);
    //         } catch (e) {
    //             error('Error fetching character class list:', e);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // if (!data) {
    return <div>Loading...</div>; // or some other placeholder/loading indicator
    // }

    // return (
    //     <div>
    //         <h1>Character Classes</h1>
    //         <ul>
    //             {data.map((characterClass) => (
    //                 <li key={characterClass.pageid}>{characterClass.title}</li>
    //             ))}
    //         </ul>
    //     </div>
    // );
}

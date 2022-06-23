import { useState } from 'react';
import AutoCompleteSearch from '../features/AutoCompleteSearch';
import useSearchActors from '../features/AutoCompleteSearch/api/useSearchActors';

export default function Home() {
  const [query, setQuery] = useState('');
  const { data } = useSearchActors({ actorName: query });

  return (
    <>
      Hi Kids
      <AutoCompleteSearch newData={data || []} newQuery={setQuery} />
    </>
  );
}

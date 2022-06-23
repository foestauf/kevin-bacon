import { Autocomplete } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'beautiful-react-hooks';
import AutoCompleteItem from './AutoCompleteItem';

const AutoCompleteSearch = ({
  newData = [],
  newQuery,
}: {
  newData: any[];
  newQuery: any;
}) => {
  const [value, setValue] = useState('');

  const valueChange = useDebouncedCallback(
    (newValue: string) => {
      newQuery(newValue);
    },
    [newQuery],
    500
  );

  useEffect(() => {
    valueChange(value);
  }, [valueChange, value]);

  return (
    <Autocomplete
      label="Search"
      placeholder="Search for actors"
      transition="pop-top-left"
      itemComponent={AutoCompleteItem}
      value={value}
      onChange={setValue}
      data={newData}
    />
  );
};

export default AutoCompleteSearch;

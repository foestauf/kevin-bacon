import { forwardRef } from 'react';
import { Avatar, Button, Group, SelectItemProps, Text } from '@mantine/core';
import { NavLink } from 'react-router-dom';

interface ItemProps extends SelectItemProps {
  color: string;
  description: string;
  image: string;
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
  // eslint-disable-next-line react/prop-types
  ({ description, value, image, ...others }: ItemProps, ref) => (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div ref={ref} {...others}>
      <Group noWrap>
        <Button>
          <NavLink to={`/people/${value}`}>
            <Avatar src={image} />
          </NavLink>
        </Button>

        <div>
          <Text>{value}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

export default AutoCompleteItem;

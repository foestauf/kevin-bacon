import { useQuery } from 'react-query';
import axiosClient from '../../../lib/axios';
import { QueryConfig } from '../../../lib/react-query';

type Actor = {
  id: string;
  name: string;
  tmdbId: string;
};

const searchActors = ({ actorName = '' }) =>
  axiosClient
    .get('/actors', {
      params: {
        name: actorName,
      },
    })
    .then(({ data }: { data: Actor[] }) =>
      data.map((actor) => ({
        value: actor.name,
        id: actor.id,
      }))
    );

type QueryFnType = typeof searchActors;

type UseSearchActorsOptions = {
  actorName: string;
  config?: QueryConfig<QueryFnType>;
};

export const useSearchActors = ({ actorName }: UseSearchActorsOptions) =>
  useQuery({
    queryKey: ['searchActors', actorName],
    queryFn: () => searchActors({ actorName }),
    keepPreviousData: true,
    enabled: actorName.length > 2,
    staleTime: 30 * 1000,
  });

export default useSearchActors;

import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {

  const getImages = async ({ pageParam = 0}) => {
    const response = await api.get(`images`);
    return response.data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    getImages, {
      getNextPageParam: (lastPage) => {
        if (lastPage.hasNextPage) {
          return lastPage.nextCursor;
        }

        return undefined;
      }
    });

  const formattedData = useMemo(() => {
    return data?.pages.map(page => {
      return {
        title: page.title,
        description: page.description,
        url: page.url,
        ts: page.ts,
        id: page.id,
      }
    })
  }, [data]);

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        <Button>Carregar mais</Button>
      </Box>
    </>
  );
}

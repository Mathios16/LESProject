import { useSearchParams } from 'react-router-dom';

function useUrlParams() {
  const [searchParams] = useSearchParams();
  return {
    type: searchParams.get('type'),
    id: searchParams.get('id')
  };
}

export default useUrlParams;
import { useCallback } from 'react';

import { useFetch } from '@/hooks/useFetch';

export interface GetModelsRequestProps {
  key: string;
}

const useApiService = () => {
  const fetchService = useFetch();

  // const getModels = useCallback(
  // 	(
  // 		params: GetManagementRoutineInstanceDetailedParams,
  // 		signal?: AbortSignal
  // 	) => {
  // 		return fetchService.get<GetManagementRoutineInstanceDetailed>(
  // 			`/v1/ManagementRoutines/${params.managementRoutineId}/instances/${params.instanceId
  // 			}?sensorGroupIds=${params.sensorGroupId ?? ''}`,
  // 			{
  // 				signal,
  // 			}
  // 		);
  // 	},
  // 	[fetchService]
  // );

  const getModels = useCallback(
    (params: GetModelsRequestProps, signal?: AbortSignal) => {
      return fetchService.post<GetModelsRequestProps>(`/api/models`, {
        body: { key: params.key },
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      })
    },
    [fetchService],
  );

  const getBalance = useCallback(
    (params: GetModelsRequestProps, signal?: AbortSignal) => {
     return fetch(`https://api.openai-sb.com/sb-api/user/status?api_key=${params.key}`, {
        headers: {
          'Content-Type': 'application/json',
          },
          signal,
          }
      ).then((res) => res.json())
    },
    [],
    )

  return {
    getModels,
    getBalance
  };
};

export default useApiService;

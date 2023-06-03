import { useQuery, gql } from '@apollo/client';

export const GetAllLocations = gql`
query MyQuery($_like: String = "") {
    misc_location(where: {pincode: {_like: $_like}}, limit: 4) {
      pincode
      state
      area
      city
      taluk
      id
      lat
      long
    }
  }
`;

export default function useGetLocation(val) {
    const { data, loading, refetch, error } = useQuery(GetAllLocations,
        {
            variables: {
                _like: `${val}%`
            }
        });
    return {
        refetch,
        loadingG: loading,
        data: data || [],
        error
    };
}
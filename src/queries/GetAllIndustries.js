import { gql } from "@apollo/client";

const GetAllIndustries = gql`
  query GetAllIndustries {
    industries(order_by: { id: asc }) {
      id
      logo
      name
    }
  }
`;
export default GetAllIndustries;

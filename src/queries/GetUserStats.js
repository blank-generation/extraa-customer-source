import { gql } from "@apollo/client";

const GetUserStats = gql`
  query CouponsWon {
    user_coupons_aggregate {
      aggregate {
        count
      }
    }
    users {
      feedback_count
      dob
      gender
      name
      preferences
      phone_number
    }
  }
`;
export default GetUserStats;

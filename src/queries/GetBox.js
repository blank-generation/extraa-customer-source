import { gql } from "@apollo/client";

const GetBoxes = gql`
  query GetBoxes($url: String) {
    boxes(where: { url: { _eq: $url } }) {
      id
      box_name
      brand_name
      logo
      title
      data_filter
      url
      status
      message
      created_at
      expiry_date
      redeem_filter
      box_coupons {
        coupon_id
      }
    }
  }
`;
export default GetBoxes;

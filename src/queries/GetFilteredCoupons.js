import { gql } from "@apollo/client";

const GetFilteredCoupons = gql`
  query GetCoupons($ind_list: [bigint!]) {
    user_coupons(
      order_by: { id: desc }
      where: { coupon: { industry: { _in: $ind_list } } }
    ) {
      id
      coupon {
        brand_logo
        brand_name
        terms
        status
        offer_type
        offer_title
        offer_subtitle
        name
        mode
        merchant_id
        location
        industry
        industry_name
        id
        expiry_date
        coupon_code
        color
        code_type
      }
    }
  }
`;
export default GetFilteredCoupons;

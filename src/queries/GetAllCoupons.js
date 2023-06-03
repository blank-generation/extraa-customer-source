import { gql } from "@apollo/client";

const GetAllCoupons = gql`
query GetCoupons {
  user_coupons(order_by: {id: desc}) {
    coupon_code
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
export default GetAllCoupons;

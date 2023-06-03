import { gql } from "@apollo/client";

const GetSurvey = gql`
query GetSurveyDetails($url: String = "") {
  surveys(where: {link: {_eq: $url}}) {
    id
    name
    form_details
    qr_id
    message
    message_title
    banner
    survey_coupons {
      coupon {
        id
        offer_subtitle
        offer_title
        location
        industry
        brand_name
        brand_logo
        color
        industry_name
        coupon_codes(limit: 1, where: {distributed: {_eq: false}}) {
          coupon_code
          id
        }
      }
    }
  }
}


`;
export default GetSurvey;

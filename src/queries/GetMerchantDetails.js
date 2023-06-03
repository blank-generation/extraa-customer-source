import { gql } from "@apollo/client";

const GetMerchantDetails = gql`
  query GetMerchantDetails($qr_code: String = "AA1005") {
    merchants(
      where: {
        merchant_spaces: {
          space: { spaces_qrs: { qr: { code: { _eq: $qr_code } } } }
        }
      }
    ) {
      details
      id
    }
  }
`;
export default GetMerchantDetails;

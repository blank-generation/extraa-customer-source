import { gql } from "@apollo/client";

const GetQRForm = gql`
  query get_form_and_questions($qr_code: String = "") {
    qr(where: { code: { _eq: $qr_code } }) {
      id
      status
      logo
      dist_coupon_amount
      qr_forms_accounts {
        form {
          id
          form_questions {
            question {
              id
              label
              status
              type
              question_options {
                option {
                  id
                  label
                }
              }
            }
          }
        }
      }
      spaces_qrs {
        space {
          location
          merchant_spaces {
            merchant {
              id
              details
              industry
              name
              logo
            }
          }
        }
      }
    }
  }
`;
export default GetQRForm;

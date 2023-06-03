import { gql } from "@apollo/client";

const SubmitAnswer = gql`
  mutation SetUserProfile(
    $id: bigint
    $name: String
    $gender: String
    $email: String
    $dob: date
    $pincode: String
  ) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: {
        name: $name
        gender: $gender
        email: $email
        dob: $dob
        pincode: $pincode
      }
    ) {
      dob
      gender
      name
      pincode
      email
    }
  }
`;
export default SubmitAnswer;

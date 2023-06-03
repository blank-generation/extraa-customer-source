import { gql } from "@apollo/client";

const UserSignUp = gql`
  mutation UpdateUserDetials(
    $id: bigint = ""
    $name: String = ""
    $gender: String = ""
    $age_range: String = ""
  ) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, gender: $gender, age_range: $age_range }
    ) {
      name
    }
  }
`;
export default UserSignUp;

/* {
  "objects": [
    {
      "user_id": 1,
      "question_id": 1,
      "answer": "",
      "form_id": 1,
      "qr_id": 1,
      "question_type": ""
    },
    {
      "user_id": 1,
      "question_id": 1,
      "answer": "",
      "form_id": 1,
      "qr_id": 1,
      "question_type": ""
    },
    {
      "user_id": 1,
      "question_id": 1,
      "answer": "",
      "form_id": 1,
      "qr_id": 1,
      "question_type": ""
    }
  ]
} */

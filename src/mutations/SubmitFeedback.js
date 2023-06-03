import { gql } from "@apollo/client";

const SubmitAnswer = gql`
mutation submit_feedback($user_id: bigint!, $form_id: bigint!, $qr_id: Int!, $objects: [answers_insert_input!]!, $action: String , $form_id1: bigint, $merchant_id: bigint) {
    insert_answers(objects: $objects) {
      returning {
        id
      }
    }
    update_users_by_pk(pk_columns: {id: $user_id}, _inc: {feedback_count: 1}) {
      feedback_count
    }
    update_qr_by_pk(pk_columns: {id: $qr_id}, _inc: {feedback_count: 1}) {
      feedback_count
    }
    update_forms_by_pk(pk_columns: {id: $form_id}, _inc: {feedback_count: 1}) {
      form_name
    }
    insert_users_activity(objects: {qr_id: $qr_id, user_id: $user_id, action: $action, form_id: $form_id, merchant_id: $merchant_id}) {
      returning {
        id
      }
    }
    }`
    ;

export default SubmitAnswer;

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
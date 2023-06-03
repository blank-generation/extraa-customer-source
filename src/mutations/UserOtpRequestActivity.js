import { gql } from "@apollo/client";

const UserOtpActivity = gql`
  mutation UserOtpActivity($action: String , $user_id: bigint , $qr_id: Int ) {
    insert_users_activity_one(object: {action: $action, user_id: $user_id, qr_id: $qr_id}) {
      id
    }
  }`
    ;

export default UserOtpActivity;

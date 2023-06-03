import { gql } from "@apollo/client";

const GetUserSubimtTimes = gql`
  query CheckIfUserHasDoneThis(
    $qr_id: Int
    $user_id: bigint = ""
    $last_date: timestamptz = ""
  ) {
    users_activity_aggregate(
      where: {
        qr_id: { _eq: $qr_id }
        user_id: { _eq: $user_id }
        created_at: { _gte: $last_date }
        action: { _eq: "SUBMIT_FEEDBACK" }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

async function getUserFeedbackTimes(client, varObj, token) {
  const { data, loading, error } = await client.query({
    context: {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    },
    query: GetUserSubimtTimes,
    variables: {
      qr_id: varObj.qrId,
      user_id: varObj.userId,
      last_date: varObj.lastDate,
    },
  });
  if (error) {
    return error;
  }
  return data;
}

export default getUserFeedbackTimes;

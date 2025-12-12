import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const { region, table_name } = process.env;

const client = new DynamoDBClient({ region });
const db = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { short_url } = event.queryStringParameters;
  const getItem = new GetCommand({
    TableName: table_name,
    Key: {
      short_url,
    },
  });

  const res = await db.send(getItem);
  if (!res) {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "URL not found" }),
    };
  }
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(res.Item),
  };
};

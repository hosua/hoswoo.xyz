import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const { region, table_name } = process.env;

const client = new DynamoDBClient({ region });
const db = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const { ip } = event;

  const getItem = new GetCommand({
    TableName: table_name,
    Key: {
      ip,
    },
  });

  const { Item } = await db.send(getItem);

  const cmd = !Item
    ? new PutCommand({
        TableName: table_name,
        Item: {
          ip,
          count: 1,
        },
      })
    : new UpdateCommand({
        TableName: table_name,
        Key: {
          ip,
        },
        UpdateExpression: "ADD #count :increment",
        ExpressionAttributeNames: {
          "#count": "count",
        },
        ExpressionAttributeValues: {
          ":increment": 1,
        },
      });

  await db.send(cmd);

  return {
    statusCode: 200,
  };
};

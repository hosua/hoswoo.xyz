import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"; // ES Modules import
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
const { region, table_name, from_email, my_email } = process.env;

const sesClient = new SESv2Client({});

const dbClient = new DynamoDBClient({ region });
const db = DynamoDBDocumentClient.from(dbClient);

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

export const handler = async (event) => {
  const { email, body, ip } = JSON.parse(event.body || {});

  const getItem = new GetCommand({
    TableName: table_name,
    Key: {
      ip,
    },
  });
  const { Item } = await db.send(getItem);

  if (!Item) {
    const sendEmail = new SendEmailCommand({
      FromEmailAddress: from_email,
      Destination: {
        ToAddresses: [my_email],
      },
      Content: {
        Simple: {
          Subject: {
            Data: `Contact form submissions from ${email}`,
          },
          Body: {
            Text: {
              Data: `From: ${email}\n\n${body}`,
            },
          },
        },
      },
    });
    await sesClient.send(sendEmail);

    // Insert to recent senders table to prevent spam
    const expire_at = Math.floor(
      (new Date().getTime() + TWO_HOURS_IN_MS) / 1000,
    );
    const putItem = new PutCommand({
      TableName: table_name,
      Item: {
        ip,
        expire_at,
      },
    });

    await db.send(putItem);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: `Successfully sent email` }),
    };
  } else {
    // User recently sent an email, block the request
    return {
      statusCode: 420,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error:
          "This IP address has sent an email recently, please wait a few hours before sending another one.",
      }),
    };
  }
};

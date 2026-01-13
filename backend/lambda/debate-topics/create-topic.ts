// AWS Lambda function to create a new debate topic
// This is a template for future implementation

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = process.env.TOPICS_TABLE_NAME || 'zentrais-topics';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // TODO: Add authentication check
    // TODO: Add input validation
    // TODO: Add rate limiting

    const body = JSON.parse(event.body || '{}');
    const { title, description, author, tags } = body;

    if (!title || !description || !author) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Missing required fields: title, description, author',
        }),
      };
    }

    const topicId = uuidv4();
    const now = new Date().toISOString();

    const topic = {
      topicId,
      title,
      description,
      authorId: author.id,
      authorName: author.name,
      tags: tags || [],
      supportCount: 0,
      counterCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: topic,
    });

    await docClient.send(command);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        topic: {
          id: topicId,
          ...topic,
        },
      }),
    };
  } catch (error) {
    console.error('Error creating topic:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Failed to create topic',
      }),
    };
  }
};


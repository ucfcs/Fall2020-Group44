import { APIGatewayEvent, Context, ProxyResult } from "aws-lambda";
import { Sequelize } from "sequelize";

// init db connection
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE as string,
  process.env.MYSQL_USER as string,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  }
);

// declare lambda function
export const hello = async (
  event?: APIGatewayEvent,
  content?: Context
): Promise<ProxyResult> => {
  try {
    // Test the db connection and creds
    await sequelize.authenticate();

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Go Serverless v1.0! Your function executed successfully!",
          input: event,
        },
        null,
        2
      ),
    };
  } catch (error) {
    throw error;
  }
};

import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import { SaveEventRequest } from '../../requests/SaveEventRequest'
import { updateEvent } from "../../services/EventService";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log("Processing Event ", event);
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    const eventId = event.pathParameters.eventId;
    const updatedEvent: SaveEventRequest = JSON.parse(event.body);

    const eventItem = await updateEvent(updatedEvent, eventId, jwtToken);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "item": eventItem
        }),
    }
};

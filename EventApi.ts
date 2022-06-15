import WaitEvent from "./WaitEvent";
import KV from '../../../../utils/KV';
import { PullDownListItem } from "../../../../core";
import { errorResponse } from "../../testCases/api/TestCaseApi";

const baseUrl = process.env.REACT_APP_EVENT_API_BASE_URL;
const apiPath = 'TestExecution';

const fetchConfig = { headers: new Headers({ Accept: 'application/json', 'Content-Type': 'application/json' }) };

const EventApi = {
    async getEvent(id: number): Promise<WaitEvent> {
        const response = await doFetch(`${baseUrl}/${apiPath}/Event/${id}`);
        const json: WaitEvent[] = await response.json();
        return json[0];
    },
    async deleteEvent(id: number): Promise<void> {
        const res = await fetch(`${baseUrl}/${apiPath}/Event/${id}`, { ...fetchConfig, method: 'DELETE' });

        if (res.ok) return;
        await errorResponse(res, 'Failed to delete Event');
    },
    async updateEvent(id: number, event: WaitEvent): Promise<void> {
        const res = await fetch(`${baseUrl}/${apiPath}/Event/${id}`, { ...fetchConfig, method: 'PUT', body: JSON.stringify(event) });

        if (res.ok) return;
        await errorResponse(res, 'Failed to update Event');
    },
    async createEvent(event: WaitEvent): Promise<number | void> {
        const res = await fetch(`${baseUrl}/${apiPath}/Event`, { ...fetchConfig, method: 'POST', body: JSON.stringify(event) });
      
        if (res.ok) return res.json();
        await errorResponse(res, 'Failed to create Event');
    },
    async getEvents(): Promise<WaitEvent[]> {
        const response = await doFetch(`${baseUrl}/${apiPath}/Events`);
        return response.json();
    },
    async getEventTypes(): Promise<KV[]> {
        const response = await doFetch(`${baseUrl}/${apiPath}/Pulldown/eventType`);
       
        const json: PullDownListItem[] = await response.json();       
          return json.map(item => new KV(item.Key, item.Name));
    },

    async getDaysOfWeeks(): Promise<KV[]> {
        const days = [
            {Key: 1, Name: 'Sunday'},
            {Key: 2, Name: 'Monday'},
            {Key: 3, Name: 'Tuesday'},
            {Key: 4, Name: 'Wednesday'},
            {Key: 5, Name: 'Thursday'},
            {Key: 6, Name: 'Friday'},
            {Key: 7, Name: 'Saturday'},
          ];        
          return days.map(item => new KV(item.Key, item.Name));
    },

    async getDateIntervalType(): Promise<KV[]> {
        const dateType = [
            {Key: 1, Name: 'Hours'},
            {Key: 2, Name: 'Days'},
            {Key: 3, Name: 'Weeks'},
            {Key: 4, Name: 'Months'},
            {Key: 5, Name: 'Years'},
          
          ];       
          return dateType.map(item => new KV(item.Key, item.Name));
    }
}

function doFetch(endpoint: string) {
    return fetch(endpoint, fetchConfig)
}

export default EventApi;
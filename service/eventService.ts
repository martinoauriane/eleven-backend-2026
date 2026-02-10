import { EventStore} from "../store/EventStore";
import { hashPassword } from "./utils/hash";
import { EventCreate, EventUpdate } from "../store/interfaces/eventInterfaces";

const eventStore = new EventStore();

interface IEventService {
    createEvent(data: EventCreate): Promise<any>;
    getEventById(id: number): Promise<any>;
    updateEvent(data:EventUpdate, id: number): Promise<any>;
    deleteEvent(id: number): Promise<any>;
}

class EventService implements IEventService{

    async createEvent(data:EventCreate): Promise<any> {
        const EventData: EventCreate = {
            eventName: data.eventName,
            eventLat: data.eventLat,
            eventLon:data.eventLon,
            eventAddress:data.eventAddress,
            city:data.city,
            country:data.country,
            eventType: data.eventType, 
            userId:data.userId,
        };
        return await eventStore.createEvent(EventData);
    }

    async getEventById(id: number) {
        return await eventStore.getEventById(id);
    }

    async updateEvent(data: EventUpdate, id: number) {
        return await eventStore.updateEvent(id, data);
    }

    async deleteEvent(id: number) {
        return await eventStore.deleteEvent(id);
    }
}

export { EventService };
import { EventStore} from "../store/eventStore";
import { EventCreate, EventUpdate } from "../store/interfaces/eventInterfaces";

const eventStore = new EventStore();

interface IEventService {
    createEvent(data: EventCreate): Promise<any>;
    getEvent(id: number): Promise<any>;
    getAllEvents(): Promise<any>;
    addEventParticipants(eventId: number, userId: number):Promise<any>;
    updateEvent(data:EventUpdate, id: number): Promise<any>
    deleteEvent(id: number): Promise<any>;
}

class EventService implements IEventService{

    async createEvent(newEvent:EventCreate): Promise<any> {
        return await eventStore.createEvent(newEvent);
    }

    async getEvent(id: number): Promise<any>{
        return await eventStore.getEventById(id);
    }

    async getAllEvents(): Promise<any>{
        let serviceEvents = await eventStore.getAllEvents();
        return serviceEvents;
    }

    async updateEvent(data: EventUpdate, id: number): Promise<any> {
        return await eventStore.updateEvent(id, data);
    }

    async addEventParticipants(eventId: number, userId: number): Promise<any>{
        return await eventStore.addEventParticipant(eventId, userId);
    }

    async getEventParticipants(eventId: number): Promise<any>{
        return await eventStore.getEventParticipants(eventId);
    }

    async deleteParticipant(userId: number): Promise<any>{
        return await eventStore.deleteParticipant(userId);
    }

    async deleteEvent(id: number): Promise<any> {
        return await eventStore.deleteEvent(id);
    }
}

export { EventService };
import { generatePath, Link, useHistory } from "react-router-dom";
import { initForm } from "../../../../core";
import PageHeader from "../../../../elements/PageHeader";
import { modules } from "../../Modules";
import EventApi from "../api/EventApi";
import WaitEvent from "../api/WaitEvent";
import { EventForm } from "../details/EventForm";

export default function EventCreatePage() {
    const { formState, onChange, onSubmit } = initForm(
        {
            name: '',
            description: '',
            EventFlag: '',
            EventTypeID: -1,
            generateSIN: 0,
            dayOfTheWeek: -1,
            dateIntervalTypeID: -1,
            dateIntervalValue: '',
            forward: '',
            reverse: '',
            dateEpoch: ''
        } as unknown as WaitEvent,
        onSubmitCallback);

    let history = useHistory();



    async function onSubmitCallback() {
        const day = formState.values.dayOfTheWeek
        const dayofWeek = (day: any) => {
            switch (day) {
                case 1:
                    return "Sunday"
                case 2:
                    return "Monday"
                case 3:
                    return "Tuesday"
                case 4:
                    return "Wednesday"
                case 5:
                    return "Thursday"
                case 6:
                    return "Friday"
                case 7:
                    return "Saturday"
                default:
                    return ""
            }
        };
        const dayofTheWeek = dayofWeek(day);

         const forwardDirection=formState.values.forward;
         const reverseDirection=formState.values.reverse;
         var dateinterDirection="";
      
         if(forwardDirection)
         {
            dateinterDirection='forward';
         }
         else if(reverseDirection){
            dateinterDirection='backward';
         }
         else{
            dateinterDirection='';
         }
             

        const createEventPostData = {
            ...formState.values,
            dateIntervalDirection:dateinterDirection,        
            dayOfTheWeek: dayofTheWeek,
        }

        let id = await EventApi.createEvent(createEventPostData);
        let eventId = Number(id);
        window.alert(`Created Event`);

        const path = generatePath(modules.events.children.eventId.path, { eventId });
        history.push(path);
    }

    return <>
        <PageHeader>Create Event</PageHeader>
        <main className="butt-content-center">
            <section className="butt-card butt-span-medium">
                <EventForm onSubmit={onSubmit} onChange={onChange} formState={formState} >
                    <div className="butt-button-panel">
                        <button type="submit" className="btn btn-primary">
                            Create
                        </button>
                        <Link to={modules.events.home} className="btn btn-default">
                            Cancel
                        </Link>
                    </div>
                </EventForm>

            </section>

        </main>
    </>
}
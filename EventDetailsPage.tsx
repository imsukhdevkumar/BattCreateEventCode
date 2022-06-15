import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { initForm } from '../../../../core';
import PageHeader from "../../../../elements/PageHeader";
import { modules } from '../../Modules';
import EventApi from '../api/EventApi';
import WaitEvent from '../api/WaitEvent';
import { EventForm } from './EventForm';


export default function EventDetailsPage() {

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
            dateEpoch: '',
        } as unknown as WaitEvent,
        onSubmitCallback);

    const [, setReady] = React.useState(false);

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

        const forwardDirection = formState.values.forward;
        const reverseDirection = formState.values.reverse;
        var dateinterDirection = "";

        if (forwardDirection) {
            dateinterDirection = 'forward';
        }
        else if (reverseDirection) {
            dateinterDirection = 'backward';
        }
        else {
            dateinterDirection = '';
        }


        const updateEventPostData = {
            ...formState.values,
            dateIntervalDirection: dateinterDirection,         
            dayOfTheWeek: dayofTheWeek,
        }

        //await EventApi.updateEvent(eventId, formState.values);
        await EventApi.updateEvent(eventId, updateEventPostData);
        window.alert('Updated Event Details');
    }

    let history = useHistory();

    let { eventId: param } = useParams<{ eventId: string }>();
    const eventId = Number(param);

    React.useEffect(() => {
        async function init() {
            const event = await EventApi.getEvent(eventId);

            if (event) {
                formState.values.name = event.name;
                formState.values.description = event.description;
                formState.values.EventFlag = event.EventFlag;
                formState.values.EventTypeID = event.EventTypeID;
                setReady(true);
            }
        }
        init();
    }, []);


    async function deleteEvent(e: React.MouseEvent) {
        e.preventDefault();

        if (window.confirm('Are you sure you want to delete this Event?')) {
            await EventApi.deleteEvent(eventId);
            history.push(modules.events.home);
        }
    }

    return <>
        <PageHeader>Event Details</PageHeader>
        <main className="butt-content-center">
            <section className="butt-card butt-span-medium">
                <EventForm onSubmit={onSubmit} onChange={onChange} formState={formState} >
                    <div className="butt-button-panel">
                        <button type="submit" className="btn btn-primary">
                            Update
                        </button>

                        <button className="btn btn-default" onClick={deleteEvent}>
                            Delete
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
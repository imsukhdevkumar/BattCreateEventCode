import React from 'react';
import { ChangeEvent, useState, useEffect } from 'react';
import AsyncDropDownList from '../../../../elements/AsyncDropDownList';
import { HTMLFormFieldElement } from '../../../../utils/FormHook';
import { FormState } from '../../../../utils/FormState';
import { ALPHANUMERIC_WITH_SPACE } from '../../../components/data/patterns';
import EventApi from '../api/EventApi';
import WaitEvent from '../api/WaitEvent';



export function EventForm(props: EventFormParams): JSX.Element {
    const { onSubmit, onChange, formState } = props;
    const [eventTypeID, setEventTypeID] = useState(0);

    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');

    const [formValid, setFormValid] = useState<boolean>(false);



    function onDateChange(event: ChangeEvent<HTMLInputElement>) {
        const nextValue = event.target.value;
        setDate(nextValue);
    }

    function onTimeChange(event: ChangeEvent<HTMLInputElement>) {
        const nextValue = event.target.value;
        setTime(nextValue);
    }

    function setDateTime() {
        if (date && time) {
            const dateEpoch = `${date}T${time}:00.000Z`;
            onChange({
                target: { name: 'dateEpoch', value: dateEpoch },
            } as ChangeEvent<HTMLInputElement>);
        }
    }

    useEffect(() => setDateTime(), [date, time]);

    useEffect(
        () => setFormValid(!!formState.values.dateEpoch),
        [formState.values]
    );

    return (
        <form onSubmit={onSubmit} className="butt-form">
            <div className="flex-row">
                <div className="flex column">
                    <div>
                        <label htmlFor="name" className="required">
                            Name (required)
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="form-control"
                            onChange={onChange}
                            required
                            maxLength={50}
                            value={formState.values.name}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="required">
                            Description (required)
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            className="form-control"
                            onChange={onChange}
                            style={{ height: 114 }}
                            required
                            maxLength={400}
                            value={formState.values.description}
                        />
                    </div>
                </div>

                <div className="flex column">
                    <div>
                        <label htmlFor="function" className="required">
                            Event Type (required)
                        </label>
                        <AsyncDropDownList
                            doApiCall={() => EventApi.getEventTypes()}
                            name="EventTypeID"
                            id="EventTypeID"
                            className="form-control"
                            onChange={onChange}
                            required
                            value={formState.values.EventTypeID}
                        />
                    </div>
                    {(formState.values.EventTypeID == 1 || formState.values.EventTypeID == 2) &&
                        <div>
                            <label htmlFor="name">Event Flag</label>
                            <input
                                type="text"
                                name="EventFlag"
                                id="EventFlag"
                                className="form-control"
                                onChange={onChange}
                                maxLength={50}
                                pattern={ALPHANUMERIC_WITH_SPACE}
                                value={formState.values.EventFlag || ''}
                            />
                        </div>
                    }
                    {formState.values.EventTypeID == 3 &&
                        <div>

                            <label htmlFor="name"></label> <input type="checkbox" value={formState.values.generateSIN} name="generateSIN"  id="generateSIN" defaultChecked={true}
                                onChange={onChange}
                            />
                            <b>Generate SIN ? </b>
                        </div>
                    }
                    {formState.values.EventTypeID == 4 &&
                        <>                  <div>

                            <span
                                id="textSpan"
                                style={{ fontWeight: 'normal' }}
                            >
                                Enter an interval type(hours,days,weeks,months,years)
                                and a value,OR
                                choose a day of the week. If a day of the week is chosen,then the
                                time interval will be the time from the start time to the next occurrence
                                of that day of the week.
                                Otherwise,time interval is the start time plus the interval.
                            </span>

                        </div>
                            <div>
                                <div className="flex-row">
                                    <div className="flex column">
                                        <label htmlFor="function" >
                                            Days Of Week
                                        </label>
                                        <AsyncDropDownList
                                            doApiCall={() => EventApi.getDaysOfWeeks()}
                                            name="dayOfTheWeek"
                                            id="dayOfTheWeek"
                                            className="form-control"
                                            onChange={onChange}
                                            required={false}
                                            value={formState.values.dayOfTheWeek}
                                        />

                                        <label htmlFor="function" >
                                            Date Interval Type
                                         </label>
                                        <AsyncDropDownList
                                            doApiCall={() => EventApi.getDateIntervalType()}
                                            name="dateIntervalTypeID"
                                            id="dateIntervalTypeID"
                                            className="form-control"
                                            onChange={onChange}
                                            required
                                            value={formState.values.dateIntervalTypeID}
                                        />

                                        <div>
                                            <label htmlFor="name" >
                                                AND
                                            </label>
                                            {<input
                                                type="text"
                                                name="dateIntervalValue"
                                                id="dateIntervalValue"
                                                className="form-control"
                                                onChange={onChange}
                                                placeholder='Interval Value'
                                                required
                                                value={formState.values.dateIntervalValue}
                                            />
                                            }

                               Direction of Time Calculation

                                           <label style={{ textAlign: 'center' }}> <input style={{ width: '100px' }} type="checkbox" name="forward" value={formState.values.forward} disabled={formState.values.reverse as unknown as boolean} onChange={onChange} />Forward </label>
                                            <label style={{ textAlign: 'center' }}> <input style={{ width: '100px' }} type="checkbox" name="reverse" value={formState.values.reverse} disabled={formState.values.forward as unknown as boolean} onChange={onChange} />Reverse</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-row">
                                    <div style={{ width: '50%', margin: '10px 10px' }}>

                                        <input
                                            type="date"
                                            name="date"
                                            id="date"
                                            className="form-control"
                                            onChange={onDateChange}
                                        ></input>
                                    </div>

                                    <div style={{ width: '50%', margin: '10px 10px' }}>

                                        <input
                                            type="time"
                                            name="time"
                                            id="time"
                                            className="form-control"
                                            onChange={onTimeChange}
                                        ></input>
                                    </div>
                                </div>

                                <p>Enter a starting date and time. Leave time blank if not needed.Leave both fields blank if you want the interval to be calculated from the time the test starts. </p>
                            </div>
                        </>

                    }

                </div>
            </div>

            {props.children}

        </form>


    );
}


export type EventFormParams = {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLFormFieldElement>) => void;
    formState: FormState<WaitEvent>;
    children: JSX.Element;
};




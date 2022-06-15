type WaitEvent = {
    name: string,
    description: string,
    EventType: string,
    EventFlag: string,
    EventID: number
    EventTypeID: number,
    generateSIN:number,
    dayOfTheWeek:string,
    dateIntervalTypeID:number,
    dateIntervalValue:number,
    forward:string,
    reverse:string,
    dateEpoch:Date
}

export default WaitEvent;
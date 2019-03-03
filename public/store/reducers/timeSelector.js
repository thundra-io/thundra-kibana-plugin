let d = new Date();
let date = new Date(d - 3600000);

export const timeSelectorOptions = [
    {
        label: 'Last 1 hour',
        value: 60,
        interval: 10,
        // convertToMonthMultiplier: 720
        converttomonthmultiplier: 720
    }, {
        label: 'Last 2 hours',
        value: 120,
        interval: 30,
        // convertToMonthMultiplier: 360
        converttomonthmultiplier: 360
    }, {
        label: 'Last 4 hours',
        value: 240,
        interval: 30,
        // convertToMonthMultiplier: 180
        converttomonthmultiplier: 180
    }, {
        label: 'Last 1 day',
        value: 1440,
        interval: 60,
        // convertToMonthMultiplier: 30
        converttomonthmultiplier: 30
    }
];

const initialState = {
    selectedOption: timeSelectorOptions[0],
    startDate: date.getTime(),
    interval: 10,
    convertToMonthMultiplier: 720 // 24 hours x 30 days
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_TIME':
            // console.log("timeSelector; action: ", action);
            return{
                ...state,
                selectedOption: action.selectedOption,
                startDate : action.val,
                interval: action.interval,
                convertToMonthMultiplier: action.convertToMonthMultiplier
            };
        default:
            return state
    }
}
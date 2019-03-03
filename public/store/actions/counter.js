export const INCREMENT = "INCREMENT";
export const INCREMENT_ODD = "INCREMENT_ODD";
export const DECREMENT = "DECREMENT";

export function incrementCounter() {
    console.log("action, counter, incrementCounter");

    return {
        type: INCREMENT,
        val: 1
    };
}

export function decrementCounter() {
    console.log("action, counter, decrementCounter");
    
    return {
        type: DECREMENT,
        val: 1
    };
}
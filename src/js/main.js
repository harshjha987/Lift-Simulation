const form = document.getElementById('form');
const main = document.getElementsByClassName('start')[0];
const buildingFloor = document.getElementById('floor-section');
const body = document.querySelector('.container');
const h1 = document.getElementById("H1");

const liftState = {
    lifts: [],
    floors: [],
    liftCalls: [],
};

form.addEventListener('submit', function(event) {
    event.preventDefault();
    main.style.display = "none";
    document.body.style.justifyContent = "flex-start";
            document.body.style.alignItems = "flex-start";
            document.documentElement.style.justifyContent = "flex-start"; // for html element
            document.documentElement.style.alignItems = "flex-start"; 

   
        
    
    const floorCount = document.getElementById('floors').value;
    const liftCount = document.getElementById('lifts').value;
     h1.innerText = `Lift Simulation with ${floorCount} Floors and ${liftCount} Lifts` 
     h1.style.justifyContent = "center"

    createFloors(floorCount, liftCount);
    createLifts(liftCount);
});

function createFloors(floors, lifts) {
    const viewportWidth = window.innerWidth;
    const calculatedWidth = 200 * lifts;
    buildingFloor.innerHTML = '';
    for (let i = 0; i < floors; i++) {
        const floorSection = document.createElement('div');
        floorSection.classList.add("floor-section");
        const floorArea = document.createElement('div');
        floorArea.classList.add("floor-area");
      
        floorSection.style.width = viewportWidth > calculatedWidth ? `${viewportWidth - 100}px` : `${calculatedWidth}px`;

        const floorNumber = floors - i - 1;
        const floorNo = document.createElement('p');
        floorNo.id = `floor ${floorNumber}`
        floorNo.innerHTML = `Floor ${floorNumber}`;

        const buttonSection = document.createElement('div');
        buttonSection.classList.add('button-section');

        const upButton = document.createElement('button');
        upButton.id = `up${floorNumber}`;
        upButton.innerHTML = "Up";

        const downButton = document.createElement('button');
        downButton.id = `down${floorNumber}`;
        downButton.innerHTML = "Down";
        const countDiv = document.createElement('div')
        countDiv.innerHTML = '';
        countDiv.classList.add('count-div')

       { i!==0 &&buttonSection.appendChild(upButton)};
        {i!== floors-1 && buttonSection.appendChild(downButton)};
        

        upButton.onclick = () => handleRequest(floorNumber,"up");
        downButton.onclick = () => handleRequest(floorNumber,"down");

        floorArea.appendChild(floorNo);
        floorSection.appendChild(floorArea);
        floorSection.appendChild(buttonSection);
        buildingFloor.appendChild(floorSection);

        liftState.floors.push({
            floorNumber: i,
            hasRequest: false
        });
    }
}

function createLifts(lifts) {
    const bottomFloor = document.querySelector('#floor-section .floor-section:last-child');
    for (let i = 0; i < lifts; i++) {
        const liftSection = document.createElement('div');
        liftSection.classList.add('lift-section');

        const leftDoor = document.createElement('div');
        const rightDoor = document.createElement('div');
        const liftNo = document.createElement('p');
        liftNo.classList.add('lift-no')
        leftDoor.className = 'door left-door';
        rightDoor.className = 'door right-door';

        leftDoor.id = `left-door${i}`;
        rightDoor.id = `right-door${i}`;

        
        
        leftDoor.appendChild(liftNo)
        liftSection.appendChild(leftDoor);
        liftSection.appendChild(rightDoor);
        
        liftSection.id = `liftSection${i}`;

        bottomFloor.appendChild(liftSection);

        liftState.lifts.push({
            currentFloor: 0,
            targetFloor: null,
            isMoving: false
        });
    }
}

function moveLift(liftIndex, targetFloor, direction) {
    const lift = liftState.lifts[liftIndex];
    const floorsToMove = Math.abs(lift.currentFloor - targetFloor);
    const moveDuration = floorsToMove * 2000;

    lift.isMoving = true;
    lift.targetFloor = targetFloor;

    const liftElement = document.querySelectorAll('.lift-section')[liftIndex];

    // Disable all buttons on the target floor to prevent other lifts from being called
    disableFloorButtons(targetFloor);

    setTimeout(() => {
        lift.currentFloor = targetFloor;
        openDoors(liftIndex, targetFloor, direction);
    }, moveDuration);

    liftElement.style.transition = `transform ${moveDuration}ms ease-in-out`;
    liftElement.style.transform = `translateY(-${targetFloor * 150}px)`; // Negative for upward movement
}
function disableFloorButtons(floorNumber) {
    const upButton = document.getElementById(`up${floorNumber}`);
    const downButton = document.getElementById(`down${floorNumber}`);

    if (upButton) upButton.disabled = true;
    if (downButton) downButton.disabled = true;
}


function handleRequest(floorNumber, direction) {
    const buttonId = direction === "up" ? `up${floorNumber}` : `down${floorNumber}`;
    const button = document.getElementById(buttonId);
    button.disabled = true;

    const existingCall = liftState.liftCalls.find(call => call.floor === floorNumber && call.direction === direction);

    if (!existingCall) {
        const call = { floor: floorNumber, direction: direction };
        liftState.liftCalls.push(call);
        processLiftQueue();
    }
}


function checkPendingRequests() {
    liftState.floors.forEach((floor, index) => {
        if (floor.hasRequest) {
            handleRequest(index);
            floor.hasRequest = false; // Clear the request after processing
        }
    });
}

function processLiftQueue() {
    if (liftState.liftCalls.length === 0) return;

    liftState.liftCalls.forEach((call, index) => {
        const availableLift = findClosestLift(call.floor);

        if (availableLift !== null) {
            moveLift(availableLift, call.floor, call.direction);
            liftState.liftCalls.splice(index, 1); // Remove the processed call
        }
    });
}


function openDoors(liftIndex, targetFloor, direction) {
    const liftElem = document.querySelectorAll('.lift-section')[liftIndex];
    const leftDoor = liftElem.querySelector('.left-door');
    const rightDoor = liftElem.querySelector('.right-door');

    setTimeout(() => {
        leftDoor.style.transform = `scaleX(0)`;
        leftDoor.style.transition = `transform 2.5s`;
        rightDoor.style.transform = `scaleX(0)`;
        rightDoor.style.transition = `transform 2.5s`;
    }, 0); // Start opening immediately

    setTimeout(() => {
        leftDoor.style.transform = `scaleX(1)`;
        leftDoor.style.transition = `transform 2.5s`;
        rightDoor.style.transform = `scaleX(1)`;
        rightDoor.style.transition = `transform 2.5s`;

        // Re-enable the button for the respective floor and direction
        const buttonId = direction === "up" ? `up${targetFloor}` : `down${targetFloor}`;
        const button = document.getElementById(buttonId);
        button.disabled = false;

        setTimeout(() => {
            liftState.lifts[liftIndex].isMoving = false;
            liftState.lifts[liftIndex].targetFloor = null;
            processLiftQueue();
        }, 2500);
    }, 2500);
}
function findClosestLift(targetFloor) {
    let closestLift = null;
    let minDistance = Infinity;

    liftState.lifts.forEach((lift, index) => {
        // Check if the lift is not moving and is not already assigned to the target floor
        if (!lift.isMoving && lift.targetFloor === null) {
            const distance = Math.abs(lift.currentFloor - targetFloor);
            if (distance < minDistance) {
                minDistance = distance;
                closestLift = index;
            }
        }
    });

    return closestLift;
}


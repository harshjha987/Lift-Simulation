const form = document.getElementById('form');
const main = document.getElementsByClassName('start')[0];
const buildingFloor = document.getElementById('floor-section');

const liftState = {
    lifts: [],
    floors: []
};

form.addEventListener('submit', function(event) {
    event.preventDefault();
    main.style.display = "none";
    const floorCount = document.getElementById('floors').value;
    const liftCount = document.getElementById('lifts').value;

    createFloors(floorCount, liftCount);
    createLifts(liftCount);
});

function createFloors(floors, lifts) {
    const viewportWidth = window.innerWidth;
    const calculatedWidth = 100 * lifts;
    buildingFloor.innerHTML = '';
    for (let i = 0; i < floors; i++) {
        const floorSection = document.createElement('div');
        floorSection.classList.add("floor-section");
        const floorArea = document.createElement('div');
        floorArea.classList.add("floor-area");
      
        floorSection.style.width = viewportWidth > calculatedWidth ? `${viewportWidth - 100}px` : `${calculatedWidth}px`;

        const floorNumber = floors - i - 1;
        const floorNo = document.createElement('p');
        floorNo.innerHTML = `Floor ${floorNumber}`;

        const buttonSection = document.createElement('div');
        buttonSection.classList.add('button-section');

        const upButton = document.createElement('button');
        upButton.id = `up${floorNumber}`;
        upButton.innerHTML = "Up";

        const downButton = document.createElement('button');
        downButton.id = `down${floorNumber}`;
        downButton.innerHTML = "Down";

       { i!==0 &&buttonSection.appendChild(upButton)};
        {i!== floors-1 && buttonSection.appendChild(downButton)};

        upButton.onclick = () => handleRequest(floorNumber);
        downButton.onclick = () => handleRequest(floorNumber);

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
        leftDoor.className = 'door left-door';
        rightDoor.className = 'door right-door';

        leftDoor.id = `left-door${i}`;
        rightDoor.id = `right-door${i}`;

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

function moveLift(liftIndex, targetFloor) {
    const lift = liftState.lifts[liftIndex];
    const floorsToMove = Math.abs(lift.currentFloor - targetFloor);
    const moveDuration = floorsToMove * 1000;

    lift.isMoving = true;
    lift.targetFloor = targetFloor;

    const liftElement = document.querySelectorAll('.lift-section')[liftIndex];
    

    liftElement.style.transition = `transform ${moveDuration}ms ease-in-out`;
    liftElement.style.transform = `translateY(-${(targetFloor) * 150}px)`; // Negative for upward movement

    setTimeout(() => {
        lift.currentFloor = targetFloor;
        openDoors(liftIndex);
       
       
    }, moveDuration);
}
function checkPendingRequests() {
    liftState.floors.forEach((floor, index) => {
        if (floor.hasRequest) {
            handleRequest(index);
            floor.hasRequest = false; // Clear the request after processing
        }
    });
}

function openDoors(liftIndex) {
    const liftElem = document.querySelectorAll('.lift-section')[liftIndex];
    const leftDoor = liftElem.querySelector('.left-door');
    const rightDoor = liftElem.querySelector('.right-door');
    
    setTimeout(() => {
        leftDoor.style.transform = `scaleX(0)`;
        leftDoor.style.transition = `transform 2.5s`;
        rightDoor.style.transform = `scaleX(0)`;
        rightDoor.style.transition = `transform 2.5s`;
    }, 0);  // Start opening immediately
    
    // Close doors by scaling them back to their original size
    setTimeout(() => {
        leftDoor.style.transform = `scaleX(1)`;
        leftDoor.style.transition = `transform 2.5s`;
        rightDoor.style.transform = `scaleX(1)`;
        rightDoor.style.transition = `transform 2.5s`;

        setTimeout(() => {
            liftState.lifts[liftIndex].isMoving = false;
            liftState.lifts[liftIndex].targetFloor = null;
            checkPendingRequests();
        }, 2500);
    }, 2500);
   
    

    // setTimeout(() => {
    //     leftDoor.style.transform = `translateX(-100%)`;
    //     leftDoor.style.transition = `transform 2.5s`;
    //     rightDoor.style.transform = `translateX(100%)`;
    //     rightDoor.style.transition = `transform 2.5s`;
    //   }, 2500);
    //   setTimeout(() => {
    //     leftDoor.style.transform = `translateX(0)`;
    //     leftDoor.style.transition = `transform 2.5s`;
    //     rightDoor.style.transform = `translateX(0)`;
    //     rightDoor.style.transition = `transform 2.5s`;

    //     setTimeout(() => {
    //         liftState.lifts[liftIndex].isMoving = false;
    //         liftState.lifts[liftIndex].targetFloor = null;
    //         checkPendingRequests();
    //     }, 2500);
    //   }, 5000);
}

function handleRequest(floorNumber) {
    const closestLift = findClosestLift(floorNumber);
    if (closestLift !== null) {
        moveLift(closestLift, floorNumber);
    }
    else {
    liftState.floors[floorNumber].hasRequest = true; // If no lift is available, mark the floor request as pending
}
}

function findClosestLift(targetFloor) {
    let closestLift = null;
    let minDistance = Infinity;

    liftState.lifts.forEach((lift, index) => {
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

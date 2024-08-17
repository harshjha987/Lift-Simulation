var siteWidth = 1280;
var scale = screen.width / siteWidth;

document
  .querySelector('meta[name="viewport"]')
  .setAttribute(
    "content",
    "width=" + siteWidth + ", initial-scale=" + scale + ""
  );
const button = document.getElementById("btn");
const lifts = document.getElementById('lifts')




if(window.location.pathname.endsWith('lift.html')){
    document.addEventListener('DOMContentLoaded', function() {
        
        const floorCount = localStorage.getItem('floorCount');
        const liftCount = localStorage.getItem('liftCount');
        

        const newDiv = document.createElement('div');
        newDiv.className = 'newDiv'
        const heading = document.createElement('h2');
        heading.innerText = `Simulation with ${floorCount} floors and ${liftCount} lifts`;
        newDiv.appendChild(heading);
        lifts.appendChild(newDiv)


      
       

        // Create the specified number of floors
        for (let i = 0; i < floorCount; i++) {
            const floorSection = document.createElement('div');
            floorSection.className = 'floor-section'
            const floor = document.createElement('div');
            floor.className = 'floor';
            floor.innerText = `Floor ${floorCount - i - 1}`;

            const buttons = document.createElement('div');
            buttons.className = 'buttons';
            const upButton = document.createElement('button');
            upButton.className = 'up-button';
            upButton.innerText = 'Up';
            const downButton = document.createElement('button');
            downButton.className = 'down-button';
            downButton.innerText = 'Down';
            buttons.appendChild(upButton);
            buttons.appendChild(downButton);
            floorSection.appendChild(floor);
            floorSection.appendChild(buttons);
            
           
           
            lifts.appendChild(floorSection);
           
            
        }
        const bottomFloor = document.querySelector('.floor-section:last-child');
        
        if (bottomFloor) {
            for (let i = 0; i < liftCount; i++) {
                const liftSection = document.createElement('div');
                liftSection.className = 'lift-section';

                const liftNumber = document.createElement('div');
                liftNumber.className = 'lift-number';
                

                liftSection.appendChild(liftNumber);
                
                // Append the liftSection to the bottomFloor
                bottomFloor.appendChild(liftSection);
            
            }
        }
        
})
}
 else {
    // Logic for the index.html page
    const button = document.getElementById("btn");

    button.addEventListener('click', function() {
        const floorCount = document.getElementById('floor').value;
        const liftCount = document.getElementById('lift').value;

        if (floorCount === "" || liftCount === "") {
            alert('Please fill all the fields');
        } else {
            // Store the floor and lift count in localStorage
            localStorage.setItem('floorCount', floorCount);
            localStorage.setItem('liftCount', liftCount);

            // Redirect to lift.html
            location.href = 'lift.html';
        }
    });
}
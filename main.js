// Start game's main loop
var loopInterval = 2000
var timer = setInterval(mainLoop, loopInterval);
// Variable to throttle wood production & calendar
var timeCount = 0;
var tickCount = 0;

// Arrays of possible buildings along with resource costs
var buildings = ["house",   "cabin",    "pasture",  "school",   "market"];
var foodCost =  [5,         0,          10,         15,         20];
var woodCost =  [0,         10,         15,         20,         20];
var diamCost =  [0,         0,          0,          0,          0];
var sciCost =   [0,         0,          50,         0,          100];


function pause()
{
    // Toggle the play/pause state of the game
    playButton = document.getElementById("play")
    pauseButton = document.getElementById("pause")

    if (playButton.style.display == "block")
    {
        playButton.style.display="none";
        pauseButton.style.display="block";
        
        // Start the main loop of the game
        timer = setInterval(mainLoop, loopInterval);
    }
    else
    {
        playButton.style.display="block";
        pauseButton.style.display="none";
        
        // stop the main loop of the game
        clearInterval(timer);
    }
}

function mainLoop()
{
	calendar()

    foodIncome()
    sciIncome()
	woodIncome()   
}

function calendar()
{
    // Count the passage of in-game time to throttle events (& eventualy allow citizen life cycle)

    window.tickCount = window.tickCount +1;

    if (window.tickCount > 4)
    {
        var day = document.getElementById("d");
        var currentDay = parseInt(day.innerHTML);

        window.tickCount = 0;
        day.innerHTML = currentDay +1;

        foodUse(); // Calculate food consumption

        if (day.innerHTML > 29)
        {
            var allSeasons = ["Spring", "Summer", "Autumn", "Winter"];

            var season = document.getElementById("m");
            var currentSeason = allSeasons.indexOf(season.innerHTML);
            
            if (currentSeason == 3)
            {
                currentSeason = -1;

                var year = document.getElementById("y");
                year.innerHTML = parseInt(year.innerHTML) + 1;

                document.getElementById("note").innerHTML = "A new year at last!"

            }

            document.getElementById("note").innerHTML = "Winter is coming... Your citizens need 20% more food in the cold, be sure to stock up."
            season.innerHTML = allSeasons[currentSeason +1];
            day.innerHTML = 1;
        }

    }

}

function foodIncome()
{
	// Calculate food income based on citizen job assignment
	var farmingF = document.getElementById("FF");
	farmingF = parseInt(farmingF.innerHTML)*2;
	
	var farmingB = document.getElementById("BF");
	farmingB = parseInt(farmingB.innerHTML);
	
	var farmingE = document.getElementById("EF");
	farmingE = parseInt(farmingE.innerHTML);
	
	// Update resources 
	var food = document.getElementById("food");
	food.innerHTML = parseInt(food.innerHTML) + farmingF + farmingB + farmingE;

    var foodIncome = Math.round(((farmingF/2) + farmingB + farmingE)/census("ALL")*10);
    switch (foodIncome)
    {
        case 0:
        default:
            document.getElementById("foodIn").innerHTML = "";
            break;

        case 1:
        case 2:
        case 3:
        case 4:
            document.getElementById("foodIn").innerHTML = ">";
            break;

        case 5:
        case 6:
        case 7:
            document.getElementById("foodIn").innerHTML = ">>";
            break;

        case 8:
        case 9:
        case 10:
            document.getElementById("foodIn").innerHTML = ">>>";
            break;
    }
    

}

function woodIncome()
{

	// Calculate food income based on citizen job assignment
	var buildingF = document.getElementById("FB");
	buildingF = parseInt(buildingF.innerHTML);
	
	var buildingB = document.getElementById("BB");
	buildingB = parseInt(buildingB.innerHTML)*2;
	
	var buildingE = document.getElementById("EB");
	buildingE = parseInt(buildingE.innerHTML);
	
	// No. of building citizens speeds up wood production
	window.timeCount = window.timeCount +1;

    if (buildingF || buildingB || buildingE) // Only increment if at least one citizen is logging
    {
        document.getElementById("woodIn").innerHTML = ">>";

        if ((window.timeCount + buildingF + buildingB + buildingE) > 9)
        {
            if (parseInt(food.innerHTML) > 4)
            {
                // Update resources
                food.innerHTML = parseInt(food.innerHTML) -5;
                wood.innerHTML = parseInt(wood.innerHTML) +1;
                window.timeCount=0;
            }
        }
    }
}

function sciIncome()
{
    // Calculate knowledge income based on citizen job assignment, ~0.5 food is used to produce 1 knowledge for most citizens, Elders are more efficient
    var sciF = document.getElementById("FS");
    sciF = parseInt(sciF.innerHTML);
    
    var sciB = document.getElementById("BS");
    sciB = parseInt(sciB.innerHTML);
    
    var sciE = document.getElementById("ES");
    sciE = parseInt(sciE.innerHTML);
    
    var food = document.getElementById("food");
    var sci = document.getElementById("sci");

    if (parseInt(food.innerHTML) > 1)
    {
        // Update resources 
        sci.innerHTML = parseInt(sci.innerHTML) + sciF + sciB + (sciE*2);
        food.innerHTML = parseInt(food.innerHTML) - Math.round((sciF + sciB + sciE)/2);
    }

    var sciIncome = Math.round((sciF + sciB + (sciE/2))/census("ALL")*10);
    switch (sciIncome)
    {
        case 0:
        default:
            document.getElementById("sciIn").innerHTML = "";
            break;

        case 1:
        case 2:
        case 3:
        case 4:
            document.getElementById("sciIn").innerHTML = ">";
            break;

        case 5:
        case 6:
        case 7:
            document.getElementById("sciIn").innerHTML = ">>";
            break;

        case 8:
        case 9:
        case 10:
            document.getElementById("sciIn").innerHTML = ">>>";
            break;
    }

}

function census(group)
{
    var farmers = parseInt(document.getElementById("FA").innerHTML) + parseInt(document.getElementById("FF").innerHTML) + parseInt(document.getElementById("FB").innerHTML) + parseInt(document.getElementById("FS").innerHTML);
    var woodcutters = parseInt(document.getElementById("BA").innerHTML) + parseInt(document.getElementById("BF").innerHTML) + parseInt(document.getElementById("BB").innerHTML) + parseInt(document.getElementById("BS").innerHTML);
    var elders = parseInt(document.getElementById("EA").innerHTML) + parseInt(document.getElementById("EF").innerHTML) + parseInt(document.getElementById("EB").innerHTML) + parseInt(document.getElementById("ES").innerHTML);

    switch(group)
    {
        case "FARMERS":
            return farmers;
            break;

        case "WOODCUTTERS":
            return woodcutters;
            break;

        case "ELDERS":
            return elders;
            break;

        case "ALL":
        default:
            return farmers + woodcutters + elders;
    }

}

function foodUse()
{
    // Food is consumed by citizens at a rate of 4 units per individual per day (a non-farmer produces 5). This is higher in winter.

    var season = document.getElementById("m").innerHTML;
    if (season == "Winter")
    {
        rate = 6;
    }
    else
    {
        rate = 4;
    }

    var consumed = census("ALL") * rate;
    document.getElementById("food").innerHTML = parseInt(document.getElementById("food").innerHTML) - consumed;
}

function addCit(source, destination)
{
    // Move 1 citizen from source cell and add it to the destination cell
    var cell = document.getElementById(source);
    
    if (parseInt (cell.innerHTML) > 0)
    {
        cell.innerHTML = parseInt(cell.innerHTML) -1;
        var cell = document.getElementById(destination);
        cell.innerHTML = parseInt(cell.innerHTML) +1;
    }
    else
    {
        alert("Insufficient citizens");
     }
}

function manualGather(resource)
{
    cell = document.getElementById(resource);
    if (resource == "wood")
    {
        food = document.getElementById("food")
        if (parseInt(food.innerHTML) > 4)
        {
            food.innerHTML = parseInt(food.innerHTML) - 5;
            cell.innerHTML = parseInt(cell.innerHTML) + 1;
        }
        else
        {
            alert("Insufficient food (5 required)")
        }
    }
    else
    {
        cell.innerHTML = parseInt(cell.innerHTML) + 1;
    }    
}

function build(item)
{
    // Create selected building using stored resources, if enough are available.

    bIndex = buildings.indexOf(item);
    var multiple = parseInt(document.getElementById(item).innerHTML);
    if (multiple == 0)
    {
        multiple = 1;
    }

    foodVal = foodCost[bIndex] * multiple;
    woodVal = woodCost[bIndex] * multiple;
    diamVal = diamCost[bIndex] * multiple;

    if (confirm(buildings[bIndex] + " costs:\n" + foodVal + " food\n" + woodVal + " wood\n" + diamVal + " diamonds\n\n Build it?"));
    {

        var food = parseInt(document.getElementById("food").innerHTML);
        var wood = parseInt(document.getElementById("wood").innerHTML);
        var diam = parseInt(document.getElementById("diam").innerHTML);


        if ((foodVal <= food & woodVal <= wood & diamVal <= diam))
        {
            document.getElementById("food").innerHTML = food - foodVal;
            document.getElementById("wood").innerHTML = wood - woodVal;
            document.getElementById("diam").innerHTML = diam - diamVal;

            document.getElementById(item).innerHTML = parseInt(document.getElementById(item).innerHTML) +1;
            showNote("The " + item + " has been completed.")
        }
        else
        {
            showNote("The " + item + " was not built.")
        }
    }
}

function showNote(text)
{
    document.getElementById("note").innerHTML = text
}
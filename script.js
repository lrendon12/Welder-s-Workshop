$(document).ready(function () {

    getProjects();

    var ctx = $("#myChart");
    var complete;
    var incomplete;
    var inProgress;
    var projects;
    var addresses;
    var status;


    var myChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Complete", "In Progress", "Incomplete"],
            datasets: [{
                label: "Tasks Completion Status",
                data: [complete, inProgress, incomplete],
                backgroundColor: [
                    "hsl(186, 100%, 50%)",
                    "hsl(60, 100%, 85%)",
                    "hsl(1, 100%, 70%)",
                ],
                borderColor: [
                    "hsl(240, 100%, 50%)",
                    "hsl(60, 100%, 50%)",
                    "hsl(0, 100%, 50%)",
                ],
                borderWidth: 2
            }]
        },

    });
    // function to declare the value of the global variables 
    function countStatus() {
        complete = $("button.complete.active").length
        incomplete = $("button.incomplete.active").length
        inProgress = $("button.inprogress.active").length
    }
    // Updates chart with how many buttons are  complete/incomplete/in progress
    function updateChart() {
        myChart.data.datasets[0].data = [complete, inProgress, incomplete];
        myChart.update();
    }

    // Adding click function to buttons and updating status and count with functions
    $(document).on("click", "button", function () {
        // THIS is reffering to the button
        if (this.classList.contains("complete")) {
            console.log("complete clicked");
            // Declaring that active element THIS is always reffering to a button
            activeElement = $(this);
            // Function call to see which button is clicked
            setActive(activeElement);
            // Function call to update totals for the chart
            countStatus();
            //function call to update status of the buttons
            updateStatus("complete", activeElement)

        } else if (this.classList.contains("inprogress")) {
            activeElement = $(this);
            setActive(activeElement);
            countStatus();
            updateStatus("inprogress", activeElement)

        } else if (this.classList.contains("incomplete")) {
            activeElement = $(this);
            setActive(activeElement);
            countStatus();
            updateStatus("incomplete", activeElement)
        } else if (this.classList.contains("location")) {
            i = $(this).parent().parent().index() - 1
            getLocation(addresses[i])
        }





        function setActive(activeElement) {

            activeElement.parent().parent().children().each(function () {

                $(this).children().removeClass("active")


            });

            activeElement.toggleClass("active");


        }

        function updateStatus(Status, activeElement) {
            var index = activeElement.parent().parent().index() - 1;
            status[index] = Status;
            localStorage.setItem("status", status);

        }

        updateChart();


    });
    var toDoBtn = document.getElementById("addtodo");
    toDoBtn.addEventListener("click", function (event) {
        event.preventDefault();
        var addToDo = document.getElementById("address").value;
        var commaReplace = addToDo.replace(/,/g, "%252C");
        var fixedAddress = commaReplace.replace(/ /g, "%20");
        console.log(fixedAddress)
        var address = fixedAddress;
        addresses.push(address);
        localStorage.setItem("address", addresses);
        console.log(addresses);

        var projectName = document.getElementById("project-name").value;
        projects.push(projectName);
        localStorage.setItem("project", projects);
        console.log(projects);
        status.push("incomplete");
        localStorage.setItem("status", status);

        var addToList = document.getElementById("to-do-list");
        var row = $("<tr>");
        var proName = $("<td>");
        var tdComp = $("<td>");
        var tdInprog = $("<td>");
        var tdIncomp = $("<td>");
        var location = $("<td>");
        var compEl = $("<button>");
        var inprogEl = $("<button>");
        var incompEl = $("<button>");
        var locationBtn = $("<button>");
        var span = $("<span>");

        $(span).html(projectName);
        $(compEl).attr("class", "btn complete").html("Complete");
        $(inprogEl).attr("class", "btn inprogress").html("In Progress");
        $(incompEl).attr("class", "btn incomplete active").html("Incomplete");
        $(locationBtn).attr("class", "btn location").html("<i class='material-icons'>gps_fixed</i>");





        $(proName).append(span);
        $(tdComp).append(compEl);
        $(tdInprog).append(inprogEl);
        $(tdIncomp).append(incompEl);
        $(location).append(locationBtn);

        $(row).append(proName);
        $(row).append(tdIncomp);
        $(row).append(tdInprog);
        $(row).append(tdComp);
        $(row).append(location);

        $(addToList).append(row);

        getLocation(address);
    });

    function getProjects() {
        if (localStorage.getItem("project") === null && localStorage.getItem("address") === null) {
            projects = [];
            status = [];
            addresses = [];

        } else {

            projects = localStorage.getItem("project").split(",").map(x => {
                return x
            });
            addresses = localStorage.getItem("address").split(",").map(x => {
                return x

            });

            status = localStorage.getItem("status").split(",").map(x => {
                return x

            });

            var addToList = $("#to-do-list");
            var completeStatus;
            var incompleteStatus;
            var inprogStatus;
            for (var i = 0; i < projects.length; i++) {

                var row = $("<tr>");
                var proName = $("<td>");
                var tdComp = $("<td>");
                var tdInprog = $("<td>");
                var tdIncomp = $("<td>");
                var location = $("<td>");
                var locationBtn = $("<button>");
                var compEl = $("<button>");
                var inprogEl = $("<button>");
                var incompEl = $("<button>");
                var span = $("<span>");

                if (status[i] === "complete") {
                    completeStatus = "btn complete active"
                    incompleteStatus = "btn incomplete"
                    inprogStatus = "btn inprogress"
                } else if (status[i] === "incomplete") {
                    completeStatus = "btn complete"
                    incompleteStatus = "btn incomplete active"
                    inprogStatus = "btn inprogress"
                } else {
                    completeStatus = "btn complete"
                    incompleteStatus = "btn incomplete"
                    inprogStatus = "btn inprogress active"
                }


                $(span).html(projects[i]);
                $(compEl).attr("class", completeStatus).html("Complete");
                $(inprogEl).attr("class", inprogStatus).html("In Progress");
                $(incompEl).attr("class", incompleteStatus).html("Incomplete");
                $(locationBtn).attr("class", "btn location").html("<i class='material-icons'>gps_fixed</i>");



                $(proName).append(span);
                $(tdComp).append(compEl);
                $(tdInprog).append(inprogEl);
                $(tdIncomp).append(incompEl);
                $(location).append(locationBtn);


                $(row).append(proName);
                $(row).append(tdIncomp);
                $(row).append(tdInprog);
                $(row).append(tdComp);
                $(row).append(location);


                $(addToList).append(row);
                countStatus();


            }


        }
    }

    function getLocation(address) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://google-maps-geocoding.p.rapidapi.com/geocode/json?language=en&address=" + address,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "google-maps-geocoding.p.rapidapi.com",
                "x-rapidapi-key": "bac4682d6fmsh029578abb1cefd5p1e11bbjsn558f94329cba",
            }

        }
        $.ajax(settings).done(function (response) {
            console.log(response);
            var latitude = response.results[0].geometry.location.lat
            console.log(latitude);
            var longitude = response.results[0].geometry.location.lng
            console.log(longitude);
            var location = {
                lat: latitude,
                lng: longitude
            };

            function initMap() {
                var map = new google.maps.Map(document.getElementById("map"), {
                    center: location,
                    zoom: 12,
                });
                var marker = new google.maps.Marker({
                    position: location,
                    map: map
                });
            };
            initMap();
        });
    }

});
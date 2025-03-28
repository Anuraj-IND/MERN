document.addEventListener("DOMContentLoaded", function() {


    const searchButton =  document.getElementById("Search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle= document.querySelector(".easy-progress");
    const mediumProgressCircle= document.querySelector(".medium-progress");
    const hardProgressCircle= document.querySelector(".hard-progress");
    const easyLabel = document.querySelector("#easy-label");
    const mediumLabel = document.querySelector("#medium-label");    
    const hardLabel = document.querySelector("#hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");
    

    function validateInput() {
        const username = usernameInput.value.trim();
        const usernameRegex = /^[a-zA-Z0-9_-]{3,15}$/; // LeetCode usernames are 3-15 characters long and can include letters, numbers, underscores, and hyphens.
        
        if (username === "") {
            alert("Please enter a username.");
            return false;
        }
        
        if (!usernameRegex.test(username)) {
            alert("Invalid username. A valid LeetCode username must be 3-15 characters long and can only include letters, numbers, underscores, and hyphens.");
            return false;
        }
        
        return true;
    }
    
    function updateProgressCircle(solved,total,circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    }
    async function fetchUserData(username) {
        try{
            searchButton.textContent = "Searching...";
            // Change button text to indicate loading
            searchButton.disabled = true; // Disable the button to prevent multiple clicks
            //clear input field
            //if the input is clear then enable the button
            const response = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}/`);
            if (!response.ok) {
                throw new Error("User not found");
            }
            usernameInput.value = ""; // Clear the input field after fetching data
            if (usernameInput.value === "") {
                searchButton.disabled = false; // Enable the button if input is empty
                searchButton.textContent = "Search";
            }
            const data = await response.json();
            console.log(data);

            // Example of your data object
            // Extracting the required values
            const { hardSolved, mediumSolved, easySolved, totalSolved, totalQuestions, totalEasy, totalHard, totalMedium } = data;
            
            // Extracting submission details
            const totalSubmission = data.totalSubmissions.find((item) => item.difficulty === "All")?.submissions || 0;
            const totalEasySubmission = data.totalSubmissions.find((item) => item.difficulty === "Easy")?.submissions || 0;
            const totalMediumSubmission = data.totalSubmissions.find((item) => item.difficulty === "Medium")?.submissions || 0;
            const totalHardSubmission = data.totalSubmissions.find((item) => item.difficulty === "Hard")?.submissions || 0;
            console.log("Total Submissions:", totalSubmission);
            console.log("Total Easy Submissions:", totalEasySubmission);
            console.log("Total Medium Submissions:", totalMediumSubmission);
            console.log("Total Hard Submissions:", totalHardSubmission);
            populateStatsCards(totalSubmission, totalEasySubmission, totalMediumSubmission, totalHardSubmission);


            let arr= [easySolved, mediumSolved, hardSolved,totalSolved,totalEasy, totalMedium, totalHard,totalQuestions]
            displayUserData (arr);
    }catch (error) {
        alert("User not found. Please check the username and try again.");
        console.error(error);
    }
    finally{
        usernameInput.value = ""; // Clear the input field after fetching data
    }
}
    function search (){
            if (!validateInput()) {
                return;
            }
            const username = usernameInput.value.trim();
            fetchUserData(username);
        
    }


    searchButton.addEventListener("click", search);





     function displayUserData (data) {
        easySolved = data[0];
        mediumSolved = data[1];
        hardSolved = data[2];
        totalSolved = data[3];
        totalEasy = data[4];
        totalMedium = data[5];
        totalHard = data[6];
        totalQuestions = data[7];
        // Set the labels
        easyLabel.innerHTML = `${easySolved} / ${totalEasy}\n Easy`;
        mediumLabel.innerHTML = `${mediumSolved} / ${totalMedium}\n Medium`;
        hardLabel.innerHTML = `${hardSolved} / ${totalHard}\n Hard`;
        updateProgressCircle(easySolved,totalEasy,easyProgressCircle);
        updateProgressCircle(mediumSolved,totalMedium,mediumProgressCircle);
        updateProgressCircle(hardSolved,totalHard,hardProgressCircle);
    }
function populateStatsCards(totalSubmission, totalEasySubmission, totalMediumSubmission, totalHardSubmission) {
        const statsCards = document.querySelectorAll(".stats-card");
        array = [{label:"totalSubmission",value:totalSubmission}, {label:"totalEasySubmission",value:totalEasySubmission},
            {label:"totalMediumSubmission",value:totalMediumSubmission},
             {label:"totalHardSubmission",value:totalHardSubmission}]
        console.log(array);
        cardStatsContainer.innerHTML=array.map(
            data=>{
                return `
                <div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
                </div>
                `
            }
        )
        // console.log(statsCards);
        // statsCards[0].querySelector(".card-value").textContent = totalSubmission;
        // statsCards[1].querySelector(".card-value").textContent = totalEasySubmission;
        // statsCards[2].querySelector(".card-value").textContent = totalMediumSubmission;
        // statsCards[3].querySelector(".card-value").textContent = totalHardSubmission;
    }
   


})

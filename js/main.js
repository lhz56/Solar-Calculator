/*jslint browser:true */
"use strict";

function addMonths(elem) {
    let annualUseKw = 0, dailyUseKw = 0, i = 0, x = 0;
    let months = document.getElementById(elem).getElementsByTagName('input');
    for (i = 0; i < months.length; i++) {
        x = Number(months[i].value);
        annualUseKw += x;
    }
    dailyUseKw = annualUseKw / 365;
    return dailyUseKw;
}

function sunHours() {
    let hrs;
    let theZone = document.forms.solarForm.zone.selectedIndex;
    theZone += 1;
    switch (theZone) {
        case 1: hrs = 6; break;
        case 2: hrs = 5.5; break;
        case 3: hrs = 5; break;
        case 4: hrs = 4.5; break;
        case 5: hrs = 4.2; break;
        case 6: hrs = 3.5; break;
        default: hrs = 0;
    }
    return hrs;
}

function calculatePanel() {
    let userChoice = document.forms.solarForm.panel.selectedIndex;
    let panelOptions = document.forms.solarForm.panel.options;
    let power = panelOptions[userChoice].value;
    let name = panelOptions[userChoice].text;
    let x = [power, name];
    return x;
}

function calculateSolar() {
    let dailyUseKw = addMonths('mpc');
    let sunHoursPerDay = sunHours();
    let minKwNeeds = dailyUseKw / sunHoursPerDay;
    let realKwNeeds = minKwNeeds * 1.25;
    let realWattNeeds = realKwNeeds * 1000;
    let panelInfo = calculatePanel();
    let panelOutput = panelInfo[0];
    let panelName = panelInfo[1];
    let panelsNeeded = Math.ceil(realWattNeeds / panelOutput);

    let feedback = `
        <p>Based on your average daily use of ${Math.round(dailyUseKw)} kWh, 
        you will need to purchase ${panelsNeeded} ${panelName} solar panels to offset 100% of your electricity bill.</p>
        <h2>Additional Details</h2>
        <p>Your average daily electricity consumption: ${Math.round(dailyUseKw)} kWh per day.</p>
        <p>Average sunshine hours per day: ${sunHoursPerDay} hours</p>
        <p>Realistic watts needed per hour: ${Math.round(realWattNeeds)} watts/hour.</p>
        <p>The ${panelName} panel you selected generates about ${panelOutput} watts per hour.</p>
    `;

    document.getElementById('feedback').innerHTML = feedback;
}

function liveCalculateSolar() {
    try {
        calculateSolar();
    } catch (error) {
        document.getElementById('feedback').innerHTML = "<p>Enter valid inputs to calculate your solar needs.</p>";
    }
}

function resetForm() {
    document.forms['solarForm'].reset();
    document.getElementById('feedback').innerHTML = "<p>Enter your information above to calculate your solar needs.</p>";
}

document.getElementById('copyButton').addEventListener('click', function() {
    const feedbackElement = document.getElementById('feedback');
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = feedbackElement.innerText; // Get the text content of the feedback section
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            alert('Results copied to clipboard!');
        } else {
            alert('Failed to copy results.');
        }
    } catch (err) {
        console.error('Error copying text: ', err);
    }
    
    document.body.removeChild(tempTextArea);
});

//select elements 
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans-container");
let quizArea = document.querySelector(".quiz-area")
let answersArea = document.querySelector(".answers-area")
let submitButton = document.querySelector(".submit-button")
let theResultsContainer = document.querySelector(".results")
let countdownSpan = document.querySelector(".countdown")
//set Option

let currentIndex = 0;
let rightAnswers = 0;


function getQuestions(){
    let myRequest = new XMLHttpRequest();
    
    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            //transform json object to javascript object
            let questionsObject = JSON.parse(this.responseText)
            let qCount = questionsObject.length

            //create bullets +set questions count 
            createBullets(qCount)
            
            //add querstions data
            addQuestionData(questionsObject[currentIndex], qCount);
            
            //start countdown 
            countdown(30,qCount)
            //click on submit 
            submitButton.onclick = () => {
                // get correct answer 
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                
                
                //increase index 
                currentIndex++;
                
                //check the answer 
                CheckAnswer(theRightAnswer , qCount);
                
                // Remove previous question 
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                //add the next Question
                addQuestionData(questionsObject[currentIndex]);
                
                //start countdown
                clearInterval(countdownInterval)
                countdown(30,qCount)
                
                //handle bullets class
                handleBullets();
                
                //show results  
                showResults(qCount);
            };
        };
    };
    myRequest.open("GET","Html_question.json", true);
    myRequest.send();
}
getQuestions();

function createBullets(num){
    countSpan.innerHTML = num;
    //crate spans 
    for (let i=0 ; i < num ; i++) {
        //create span
        let theBullet = document.createElement("span");
        
    }
}

function addQuestionData (obj , count) {
    if(currentIndex < 10) {  ////////////////////////////////////////////////////////error here 
        //creata h2 question
        let questionsTitle = document.createElement("h2");
        
        //create question Texxt 
        let questionText = document.createTextNode(obj['title']);
        
        //append text to h2 
        questionsTitle.appendChild(questionText);
        
        //append h2 to quizArea
        quizArea.appendChild(questionsTitle);
        
        //create the answers 
        for (let  i=1 ; i<=4 ; i++){
            //create main answer div 
            let mainDiv = document.createElement("div");
            mainDiv.className = 'answer';
            
            
            //create radio input 
            let radioInput = document.createElement("input");
            
            //add Typt + name + id + data-attribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            //create label
            let theLabel = document.createElement("label");
            //add for attribute for label
            theLabel.htmlFor = `answer_${i}`;
            //create label tex 
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);
            //add text to label
            theLabel.appendChild(theLabelText);
            // append input + label to main div 
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
            //append all divs to answers area 
            answersArea.appendChild(mainDiv)
        }
    }
}


function CheckAnswer(rAnswer , count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for (let i = 0 ; i< answers.length ; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans-container span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index) => {
        if(currentIndex === index){
            span.className = 'on';
        }
    })
}

function showResults(count){
    let theResults 
    if (currentIndex === count) {
        quizArea.remove()
        answersArea.remove()
        submitButton.remove()
        bullets.remove()
        
        if(rightAnswers > (count / 2)&& rightAnswers <count){
            theResults = `<span class = "good">Good </span> ,you answered ${rightAnswers} correct from ${count} `
        } else if (rightAnswers === count) {
            theResults = `<span class = "perfect">Excellent </span> , All answers are correct`
        } else if(rightAnswers === 0 ){
            theResults = `<span class = "bad">Bad </span> ,you answered ${rightAnswers} correct from ${count} `
        } else {
            theResults = `<span class = "bad">Accetpable </span> ,you answered ${rightAnswers} correct from ${count} `
        }
        theResultsContainer.innerHTML = theResults;
    }
}

function countdown(duration , count) {
    if (currentIndex < count) {
        let minutes , seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            
            
            minutes = minutes < 10 ?`0${minutes}` : minutes;
            seconds = seconds < 10 ?`0${seconds}` : seconds;
            countdownSpan.innerHTML =`${minutes} m :${seconds} s`
            if(--duration < 0){
                clearInterval(countdownInterval)
                submitButton.click()
            }
        },1000)
    }
}
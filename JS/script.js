var studentName = "";
var quizScore = 0;
const selectedAnswer=[];
var scores = [];

function loginValidation(){
    var uname = document.myForm.uname.value;
    var mail = document.myForm.mail.value;
    var pwd = document.myForm.pwd.value;
    var status = true;

    if(uname==null || uname==""){
        document.getElementById("nameValid").innerHTML = "Please enter your name!!";
        status = false;
    }
    else{
        document.getElementById("nameValid").innerHTML = "";
    }
    if(mail==null || mail==""){
        document.getElementById("mailValid").innerHTML = "Please Enter the E-mail Id!!";
        status = false;
    } else{
        document.getElementById("mailValid").innerHTML = "";
        var atpos = mail.indexOf("@");
        if(atpos<2){
            document.getElementById("mailValid").innerHTML = "Please Enter valid E-mail Id - username part";
            status = false;
        }else{
            document.getElementById("mailValid").innerHTML = "";
            var afterat = mail.substring(atpos+1);
            // document.getElementById("mailValid").innerHTML = afterat;
            if(!(/vitstudent.ac.in/).test(afterat)){
                document.getElementById("mailValid").innerHTML = "Enter the valid VIT Student Email Id- @vitstudent.";
                status = false;
            }
            if(status==true && !(/[1-9][0-9]{3}/).test(mail.substring(0, atpos))){
                document.getElementById("mailValid").innerHTML = "Enter the valid VIT Student Email Id with year of admission";
                status = false;
            }
        }
    }
    if((pwd==null || pwd=="")){
        document.getElementById("pwdValid").innerHTML = "Please Enter the password!!";
        status=false;
    }else{
        document.getElementById("pwdValid").innerHTML = "";
        if(pwd.length < 8){
            document.getElementById("pwdValid").innerHTML = "Password must be of 8 characters!";
            status=false;
        }else if((/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).test(pwd)){
            document.getElementById("pwdValid").innerHTML = "Password should contain lower case, upper case and a digit..";
        }else{
            document.getElementById("pwdValid").innerHTML = "";
        }
    }
    if(status==true){
        localStorage.setItem("sname",String(uname));
    }
    return status;
}
let x;
//Countdown Timer
function Countdown(elename, limit){
    var countDownDate = (new Date().getTime())+(limit*60*1000);

    x = setInterval(function(){
        var now = new Date().getTime();
        var dist = countDownDate-now;
        var minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.ceil((dist % (1000 * 60)) / 1000);
        if(minutes <= 4){
            document.getElementById(elename).style.color = "red";
            document.getElementById(elename).style.fontWeight = "bold";
        }
        document.getElementById(elename).innerHTML = twoDigits(minutes) + "m " + twoDigits(seconds) + "s ";
        if(dist < 0){
            clearInterval(x);
            document.getElementById(elename).innerHTML = "Time up";
            endQuiz();
        }
    }, 1000);

    function twoDigits(n){
        return (n<=9 ? "0"+n : n);
    }
}

if(document.getElementById("qno")){
    if(document.getElementById("qno").innerHTML == "Quiz Finished"){
        clearInterval(x);
    }
}

function endQuiz(){
    document.getElementById("roundForm").style.display = "none";
    document.getElementById("qnoTag").innerHTML = "";  
    document.getElementById("qno").innerHTML = "Quiz Finished";
    document.getElementById("question").innerHTML = "Please Go to Next Round";
    if(document.getElementById("Logoimg")){
        document.getElementById("question").innerHTML = "You can See Your Results by Ending Quiz!..";
        document.getElementById("Logoimg").style.display = "none";
        document.getElementById("logo").style.display = "none";
    }
    document.getElementById("question").style.color = "red";
    document.getElementById("question").style.textAlign = 'center';
    document.getElementById("submit").style.display = "block";
    document.getElementById("next").style.display = "none";
    document.getElementById("prev").style.display = "none";
    selectedAnswer = [];
}

function fillInfoPanel(elename){
    document.getElementById(elename).innerHTML = localStorage.getItem("sname");
}

function roundDetails(roundName, syllabus, duration, mark){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        const myObj = JSON.parse(this.responseText);
        document.getElementById(syllabus).innerHTML = myObj.syllabus;
        document.getElementById(duration).innerHTML = myObj.duration;
        document.getElementById(mark).innerHTML = myObj.marks;
      }
      xmlhttp.open("GET", "../questions/"+roundName+".json");
      xmlhttp.send();
}

function mobroundDetails(roundName, syllabus, duration, qns){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        const myObj = JSON.parse(this.responseText);
        document.getElementById(syllabus).innerHTML = myObj.syllabus;
        document.getElementById(duration).innerHTML = myObj.duration;
        document.getElementById(qns).innerHTML = myObj.qn.length;
      }
      xmlhttp.open("GET", "../questions/"+roundName+".json");
      xmlhttp.send();
}

var qnslength;

function fetchQn(roundName, qNo) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        const myObj = JSON.parse(this.responseText);
        qnslength = myObj.qn.length;
        if(qNo <= myObj.qn.length && qNo > 0){
            document.getElementById("qno").innerHTML = myObj.qn[qNo-1].qnNo;
            document.getElementById("question").innerHTML = myObj.qn[qNo-1].question;
            if(roundName=="round3"){
                var imgLoc = myObj.qn[qNo-1].logo;
                document.getElementById("logo").src = imgLoc;
            }
            document.getElementById("option1label").innerHTML = myObj.qn[qNo-1].option1;
            document.getElementById("option2label").innerHTML = myObj.qn[qNo-1].option2;
            document.getElementById("option3label").innerHTML = myObj.qn[qNo-1].option3;
            document.getElementById("option4label").innerHTML = myObj.qn[qNo-1].option4;
            document.getElementsByName("answers").forEach(ans => ans.checked=false);
            document.getElementsByName("answers").forEach(ans => {
                if(ans.id == selectedAnswer[qNo-1])
                    ans.checked = true;
                else
                    ans.checked = false;
            });
            showPrevButton();
            nextToSubmit(qNo, roundName);
        }
    }
    xmlhttp.open("GET", "../questions/"+roundName+".json");
    xmlhttp.send();
}

function showPrevButton(){
    document.getElementById("prev").style.display = "block";
}

function goNext(roundName){
    var next_SubmitVal = document.getElementById("next").innerHTML;
    if(next_SubmitVal == "Submit"){
        var temp =getSelected();
        if(temp){ selectedAnswer[Number(qno)-1] = temp;}
        var curr = 0;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/questions/"+roundName+".json");
        xmlhttp.send();
        xmlhttp.onload = function() {
            const Obj = JSON.parse(this.responseText);
            const leng = Obj.qn.length;
            for(var i=0; i<selectedAnswer.length; i++){
                if(selectedAnswer[i] == Obj.qn[i].ans){
                    curr++;
                }
            }
            if(selectedAnswer[NaN] == Obj.qn[leng-1].ans){
                    curr++;
            }
            localStorage.setItem(roundName, curr);
            scores[Number(roundName.slice(5))-1] = curr;
        }
        endQuiz();
        clearInterval(x);
    }
    var qno = document.getElementById("qno").innerHTML;
    fetchQn(roundName, Number(qno)+1);
    var temp =getSelected();
    if(temp){
        selectedAnswer[Number(qno)-1] = temp;
        document.getElementById("navbutton"+qno).style.backgroundColor = "green";
    }else{
        if(qno)
            document.getElementById("navbutton"+qno).style.backgroundColor = "red";
    }
}

function goPrev(roundName){
    var qno = document.getElementById("qno").innerHTML;
    fetchQn(roundName, Number(qno)-1);
    var temp =getSelected();
    if(temp){
        selectedAnswer[Number(qno)-1] = temp;
        document.getElementById("navbutton"+qno).style.backgroundColor = "green";
    } else{
        document.getElementById("navbutton"+qno).style.backgroundColor = "red";
    }
}

function getSelected() {
    const ansEls = document.getElementsByName("answers");
    let answer;
    ansEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.id;
        }
    });
    return answer;
}

function navToLoad(roundName, qno){
    fetchQn(roundName, qno);
    var temp = getSelected();
    if(temp){
        selectedAnswer[Number(document.getElementById("qno").innerHTML)-1] = temp;
    }
    document.getElementsByName("answers").forEach(ans => {
        if(ans.id == selectedAnswer[qno-1])
            ans.checked = true;
        else
            ans.checked = false;
    });
}

function nextToSubmit(qno, roundName){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        const myObj = JSON.parse(this.responseText);
        qnslength = myObj.qn.length;
    }
    xmlhttp.open("GET", "/questions/"+roundName+".json");
    xmlhttp.send();
    if(qno == qnslength){
        document.getElementById("next").innerHTML = "Submit";
    }
    if(qno==1){
        document.getElementById("prev").style.display = "none";
    }
    if(qno<qnslength){
        document.getElementById("next").innerHTML = "Next";
    }
}

function correction(roundName){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "/questions/"+roundName+".json");
    xmlhttp.send();
    var temp = 0;
    xmlhttp.onload = function() {
        const Obj = JSON.parse(this.responseText);
        for(var i=0; i<selectedAnswer.length; i++){
            if(selectedAnswer[i] == Obj.qn[i].ans){
                temp++;
            }
        }
        scores[Number(roundName.slice(5))-1] = temp;
    }
    endQuiz();
    clearInterval(x);
}

function eraseAllTemp(){
    localStorage.clear();
}

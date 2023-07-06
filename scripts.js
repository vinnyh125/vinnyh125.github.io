$(document).ready(function () {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let interval = null;

    document.getElementById("english-name").onmouseover = event => {  
    let iteration = 0;
    
    clearInterval(interval);
    
    interval = setInterval(() => {
        event.target.innerText = event.target.innerText
        .split("")
        .map((letter, index) => {
            if(index < iteration) {
            return event.target.dataset.value[index];
            }
        
            return letters[Math.floor(Math.random() * 26)]
        })
        .join("");
        
        if(iteration >= event.target.dataset.value.length){ 
            clearInterval(interval);
            document.getElementById("chinese-name").style.opacity = "0.35";
            document.getElementById("chinese-name").style.transition = "opacity 3s";
            document.getElementById("navbar").style.opacity = "1.0";
            document.getElementById("navbar").style.transition = "opacity 3s";
        }
        iteration += 1 / 3;
    }, 50);
    }
});


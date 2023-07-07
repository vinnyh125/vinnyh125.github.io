$(document).ready(function () {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const name = "VINCENT HUANG";
    const student = "CORNELL STUDENT";
    const music = "MUSIC LOVER";
    const badminton = "BADMINTON PLAYER";

    let mouseOver = 0;

    let interval = null;

    let navbarHeight = document.getElementById("navbar").offsetHeight;

    document.getElementById("english-name").onmouseover = event => { // I think I used some redundant code which I will fix in the future :^)
        if (mouseOver % 4 === 0) {
            let iteration = 0;

            clearInterval(interval);

            interval = setInterval(() => {
                event.target.innerText = name.split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return name.split("")[index];
                        }

                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= name.split("").length) {
                    clearInterval(interval);
                    document.getElementById("chinese-name").style.opacity = "0.35";
                    document.getElementById("chinese-name").style.transition = "opacity 3s";
                    document.getElementById("navbar").style.opacity = "1.0";
                    document.getElementById("navbar").style.transition = "opacity 2s";
                    document.getElementById("navbar").style.animationName = "slideUp";
                    document.getElementById("navbar").style.animationDuration = "1s";
                    mouseOver++;
                    console.log(mouseOver);
                }
                iteration += 1 / 3;
            }, 50);
        } else if (mouseOver % 4 === 1) {
            let iteration = 0;

            clearInterval(interval);

            interval = setInterval(() => {
                event.target.innerText = student.split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return student.split("")[index];
                        }

                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= student.split("").length) {
                    clearInterval(interval);
                    mouseOver++;
                    console.log(mouseOver);
                }
                iteration += 1 / 2;
            }, 50);
        } else if (mouseOver % 4 === 2) {
            let iteration = 0;

            clearInterval(interval);

            interval = setInterval(() => {
                event.target.innerText = music.split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return music.split("")[index];
                        }

                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= music.split("").length) {
                    clearInterval(interval);
                    mouseOver++;
                    console.log(mouseOver);
                }
                iteration += 1 / 3;
            }, 50);
        } else if (mouseOver % 4 === 3) {
            let iteration = 0;

            clearInterval(interval);

            interval = setInterval(() => {
                event.target.innerText = badminton.split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return badminton.split("")[index];
                        }

                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= badminton.split("").length) {
                    clearInterval(interval);
                    mouseOver++;
                    console.log(mouseOver);
                }
                iteration += 1 / 2;
            }, 50);
        }
    };

    document.getElementById("english-name").onclick = event => {
        if (mouseOver % 4 === 0) {
            let iteration = 0;

            clearInterval(interval);

            interval = setInterval(() => {
                event.target.innerText = name.split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return name.split("")[index];
                        }

                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= name.split("").length) {
                    clearInterval(interval);
                    document.getElementById("chinese-name").style.opacity = "0.35";
                    document.getElementById("chinese-name").style.transition = "opacity 3s";
                    document.getElementById("navbar").style.opacity = "1.0";
                    document.getElementById("navbar").style.transition = "opacity 2s";
                    document.getElementById("navbar").style.animationName = "slideUp";
                    document.getElementById("navbar").style.animationDuration = "1s";
                    mouseOver++;
                    console.log(mouseOver);
                }
                iteration += 1 / 3;
            }, 50);
        } else if (mouseOver % 4 === 1) {
            let iteration = 0;

            clearInterval(interval);

            interval = setInterval(() => {
                event.target.innerText = student.split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return student.split("")[index];
                        }

                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= student.split("").length) {
                    clearInterval(interval);
                    mouseOver++;
                    console.log(mouseOver);
                }
                iteration += 1 / 3;
            }, 50);
        } else if (mouseOver % 4 === 2) {
            let iteration = 0;

            clearInterval(interval);

            interval = setInterval(() => {
                event.target.innerText = music.split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return music.split("")[index];
                        }

                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= music.split("").length) {
                    clearInterval(interval);
                    mouseOver++;
                    console.log(mouseOver);
                }
                iteration += 1 / 3;
            }, 50);
        } else if (mouseOver % 4 === 3) {
            let iteration = 0;

            clearInterval(interval);

            interval = setInterval(() => {
                event.target.innerText = badminton.split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return badminton.split("")[index];
                        }

                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= badminton.split("").length) {
                    clearInterval(interval);
                    mouseOver++;
                    console.log(mouseOver);
                }
                iteration += 1 / 3;
            }, 50);
        }
    };
});

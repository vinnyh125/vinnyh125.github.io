$(document).ready(function () {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const name = "VINCENT HUANG";
    const student = "CORNELL STUDENT";
    const music = "MUSIC LOVER";
    const badminton = "BADMINTON PLAYER";

    let mouseOver = 0;

    let interval = null;

    let firstTime = true;

    let navbarHeight = document.getElementById("navbar").offsetHeight;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, { threshold: 0.5 });

    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach((el) => observer.observe(el)); 
    
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
                    document.getElementById("skills-main").style.display = "block";
                    document.getElementById("projects-main").style.display = "block";
                    document.getElementById("about-main").style.display = "block";
                    document.getElementById("separator-one").style.display = "block";
                    document.getElementById("separator-two").style.display = "block";
                    setTimeout(() => {
                        document.getElementById("footer").style.display = "block";
                    }, 100);
                    
                    mouseOver++;
                    if (firstTime) {
                        document.getElementById("cover").style.display = "block";
                        document.getElementById("cover").style.top = navbarHeight + "px";
                        setTimeout(() => {
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
                                }
                                iteration += 1 / 2;
                            }, 50);
                        }, 3000);
                        setTimeout(() => {
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
                                }
                                iteration += 1 / 3;
                            }, 50);
                        }, 6000);
                        setTimeout(() => {
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
                                }
                                iteration += 1 / 2;
                            }, 50);
                        }, 9000);
                        setTimeout(() => {
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
                                }
                                iteration += 1 / 3;
                            }, 50);
                        }, 12000);
                        setTimeout(() => {
                            document.getElementById("cover").style.display = "none";
                        }, 14400);
                        firstTime = false;
                    }
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
                    document.getElementById("skills-main").style.display = "block";
                    document.getElementById("projects-main").style.display = "block";
                    document.getElementById("about-main").style.display = "block";
                    document.getElementById("separator-one").style.display = "block";
                    document.getElementById("separator-two").style.display = "block";
                    mouseOver++;
                    if (firstTime) {
                        document.getElementById("cover").style.display = "block";
                        document.getElementById("cover").style.top = navbarHeight + "px";
                        setTimeout(() => {
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
                                }
                                iteration += 1 / 2;
                            }, 50);
                        }, 3000);
                        setTimeout(() => {
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
                                }
                                iteration += 1 / 3;
                            }, 50);
                        }, 6000);
                        setTimeout(() => {
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
                                }
                                iteration += 1 / 2;
                            }, 50);
                        }, 9000);
                        setTimeout(() => {
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
                                }
                                iteration += 1 / 3;
                            }, 50);
                        }, 12000);
                        setTimeout(() => {
                            document.getElementById("cover").style.display = "none";
                        }, 14400);
                        firstTime = false;
                    }
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
                }
                iteration += 1 / 2;
            }, 50);
        }
    };
});
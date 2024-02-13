// 1. Select the element to observe
const para = document.querySelector(".breakpoint")

//2. Create a callback function
let check = -1

function visibleElement(ev){
    console.dir(ev[0].isIntersecting)
    if(ev[0].isIntersecting == false){
        if(check == 1){
            document.querySelector(".accept").disabled = false;
        }else{
            document.querySelector(".accept").disabled = true;
        }
        check *= -1;
    }
}

//3. Create an object from class IntersectionObserver
const term = document.querySelector(".terms-and-conditions");
const obs = new IntersectionObserver(visibleElement, {
    root: term,
    threshold: [0, 0.5, 1],
})

//4. Identify the target element of the IntersectionObserver
obs.observe(para)

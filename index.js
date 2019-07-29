const poseCardContainer = getElementById("poses-div")

fetch("http://localhost:3000/poses").then(res => (res.json() ))
.then(function (res){
    console.log(res);
})


function createPoseCard(aPoseApi){
    c = document.createElement("DIV");
    c.style.backgroundColor = "sky blue";
    n = document.createElement("P");
    n.innerText = aPoseApi.name + " - " + aPoseApi.sanskrit_name;

    c.appendChild(n);
    poseCardContainer.appendChild(c);
    
    


}
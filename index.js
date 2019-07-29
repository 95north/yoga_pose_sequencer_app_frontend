const poseCardContainer = document.querySelector("#poses-div")




function createPoseCard(){
    // c = document.createElement("DIV");
    // c.style.backgroundColor = "sky blue";
    // n = document.createElement("P");
    // n.innerText = aPoseApi.name + " - " + aPoseApi.sanskrit_name;
    //
    // c.appendChild(n);
    // poseCardContainer.appendChild(c);

    fetch("http://localhost:3000/poses")
    .then(function(response){
      return response.json()
    })
    .then(function(pose){
      pose.forEach(function(pose){
        const poseCards = document.createElement("div")
        poseCards.classList.add("card")
        let poseHeaderName = document.createElement("h2")
        poseHeaderName.innerText = pose.pose_name
        poseCards.appendChild(poseHeaderName)
        let poseImage = document.createElement("img")
        poseImage.src = pose.photo_url
        poseImage.classList.add("center")
        poseCards.appendChild(poseImage)
        let poseIntensity = document.createElement("h3")
        poseIntensity.innerText = "Intensity: "+ pose.intensity
        poseCards.appendChild(poseIntensity)
        let posePurpose = document.createElement("h3")
        posePurpose.innerText = "Purpose: "+pose.purpose
        poseCards.appendChild(posePurpose)
        let poseProp = document.createElement("h3")
        poseProp.innerText = "Props: "+ pose.prop
        poseCards.appendChild(poseProp)
        let addPoseButton = document.createElement("button")
        addPoseButton.classList.add("button")
        addPoseButton.innerText = "Add Pose"
        poseCards.appendChild(addPoseButton)
        poseCardContainer.appendChild(poseCards)

      })


    })
} //edn of createPoseCard




createPoseCard()

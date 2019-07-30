const poseCardContainer = document.querySelector(".flip-card")
const posesDiv = document.querySelector(".poses-div")


// function createPoseCard(){
//   fetch("http://localhost:3000/poses")
//     .then(function(response){
//       return response.json()
//     })
//     .then(function(pose){
//       pose.forEach(function(pose){
//         const poseCards = document.createElement("div")
//         poseCards.classList.add("card")
//         let poseHeaderName = document.createElement("h2")
//         poseHeaderName.innerText = pose.pose_name
//         poseCards.appendChild(poseHeaderName)
//         let poseImage = document.createElement("img")
//         poseImage.src = pose.photo_url
//         poseImage.classList.add("center")
//         poseCards.appendChild(poseImage)
//         let poseIntensity = document.createElement("h3")
//         poseIntensity.innerText = "Intensity: "+ pose.intensity
//         poseCards.appendChild(poseIntensity)
//         let posePurpose = document.createElement("h3")
//         posePurpose.innerText = "Purpose: "+pose.purpose
//         poseCards.appendChild(posePurpose)
//         let poseProp = document.createElement("h3")
//         poseProp.innerText = "Props: "+ pose.prop
//         poseCards.appendChild(poseProp)
//         let addPoseButton = document.createElement("button")
//         addPoseButton.classList.add("button")
//         addPoseButton.innerText = "Add Pose"
//         poseCards.appendChild(addPoseButton)
//         poseCardContainer.appendChild(poseCards)
//       })
//     })
// } //edn of createPoseCard



//test

function createPoseCard(){
  fetch("http://localhost:3000/poses")
    .then(function(response){
      return response.json()
    })
    .then(function(pose){
      pose.forEach(function(pose){
        // const flipCardInner = document.querySelector(".flip-card-inner")
        const flipCardInner = document.createElement("div")
        flipCardInner.classList.add("flip-card-inner")
        const poseCards = document.createElement("div")
        poseCards.classList.add("flip-card-front")
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
        flipCardInner.appendChild(poseCards)
        // poseCardContainer.appendChild(flipCardInner)
        // posesDiv.appendChild(poseCardContainer)


        backPoseCardSequenceInfo(flipCardInner)
        // poseCardContainer.appendChild(poseCards)
      })
    })
} //edn of createPoseCard


function backPoseCardSequenceInfo(flipCardInner){
  fetch("http://localhost:3000/sequences")
  .then(function(response){
    return response.json()
  })
  .then(function(json){
    json.forEach(function(sequence){
      const poseCardBack = document.createElement("div")
      poseCardBack.classList.add("flip-card-back")
      const sequenceName = document.createElement("h2")
      sequenceName.innerText = sequence.sequence_name
      poseCardBack.appendChild(sequenceName)
      flipCardInner.appendChild(poseCardBack)
      poseCardContainer.appendChild(flipCardInner)
      posesDiv.appendChild(poseCardContainer)
    })
  })

} //end of backPoseCardSequenceInfo





createPoseCard()

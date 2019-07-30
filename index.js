
const navHeader = document.getElementById("nav-header");
const newSeqBtn = document.getElementById("new-sequence");
const viewSeqsBtn = document.getElementById("view-sequences");
const currentSeqContainer = document.getElementById("current-sequence");

const sequencesUL = document.createElement("UL");
// const poseCardContainer = document.getElementById("poses-div");



    newSeqBtn.addEventListener("click", function(e){
        clearPoseCardContainer();
        const newSeqForm = document.createElement("FORM")
        let f =
            ` <br>
            <br>
            New Sequence Name:<br>
            <input type="text" name="newSeqName"><br>
            New Sequence Memo:<br>
            <input type="text" name="newSeqMemo"><br>
            New Sequence Yoga Style:<br>
            <input type="text" name="newSeqStyle"><br>
            <input type="submit" value="Submit"> `
        newSeqForm.innerHTML = f;
        poseCardContainer.appendChild(newSeqForm);

        newSeqForm.addEventListener("submit", function(e){
            createNewSequence(e)
        })
    })


    function createNewSequence(e){
        clearCurrentSeqContainer();
        let newSeqName = e.target[0].value
        let newSeqMemo = e.target[1].value
        let newSeqStyle = e.target[2].value
        e.preventDefault();

        fetch('http://localhost:3000/sequences/', {
            method: 'POST',
            headers: { "Content-Type": "application/json; charset=utf-8", "Accept": 'application/json' },
            body: JSON.stringify({
                "user_id": 4,                           // HARD-CODED !!!
                "sequence_name": newSeqName,
                "memo": newSeqMemo,
                "yoga_style": newSeqStyle
            })
        }).then(res => (res.json() ))
        .then(function (res){
            console.log(res);
            let currentSeq = document.createElement("P");
            currentSeq.innerText = `Current Sequence: ${res["sequence_name"]}.  Yoga Style: ${res["yoga_style"]}`
            currentSeq.dataset.seqid = res["id"];
            currentSeq.dataset.memo = res["memo"];
            currentSeq.dataset.yogastyle = res["yoga_style"];
            currentSeqContainer.appendChild(currentSeq);

        })
        clearPoseCardContainer();
    }



    viewSeqsBtn.addEventListener("click", function(e){
        //clearPoseCardContainer();
        const allSeqsUL = document.getElementById("allSeqsUL");

        fetchAllSequences();
    })


    function fetchAllSequences(){
        clearPoseCardContainer();
        sequencesUL.classList.add("allSeqList")

        fetch("http://localhost:3000/sequences/", {
            method: 'GET',
            headers: { "Content-Type": "application/json; charset=utf-8" }
            }).then(res => (res.json() ))
            .then(function (res){
                for (const sequenceRecord of res) {
                    createSequenceLi(sequenceRecord)
                }
            })
        }


    function createSequenceLi(sequenceRecord){
        const sequenceLi = document.createElement("LI");
        sequenceLi.innerText = `Name: ${sequenceRecord["sequence_name"]},    Style: ${sequenceRecord["yoga_style"]},    Memo:  ${sequenceRecord["memo"]}`

        sequenceLi.dataset.seqid = sequenceRecord["id"];
        sequenceLi.dataset.memo = sequenceRecord["memo"];
        sequenceLi.dataset.yogastyle = sequenceRecord["yoga_style"];

        appendSequenceLiDeleteBtn(sequenceLi);

        sequencesUL.appendChild(sequenceLi);
        poseCardContainer.appendChild(sequencesUL);
    }

    function appendSequenceLiDeleteBtn(seqLi){
        // let sequenceLiDeleteBtn = document.createElement("BUTTON");
        console.log("seqLi is: ", seqLi);

        let spanDelete = document.createElement("span");
        spanDelete.setAttribute("id", seqLi.dataset.seqid);
        spanDelete.setAttribute("class", "delete");
        spanDelete.innerHTML = " ......Delete "; //"&nbsp;&#10007;&nbsp;";
        spanDelete.onclick = deleteSequence;
        seqLi.appendChild(spanDelete);
    }


    function deleteSequence(e){
        e.preventDefault();

        let seqIdToDelete = e.target.id;

        fetch(`http://localhost:3000/sequences/${seqIdToDelete}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json; charset=utf-8", "Accept": 'application/json' },
            body: JSON.stringify({
                 "id": seqIdToDelete
            })
        }).then(res => (res.json() ))
        .then(function (res){
            console.log(res);
        })
    }


    function clearPoseCardContainer(){
        while (poseCardContainer.firstChild) {
            poseCardContainer.removeChild(poseCardContainer.firstChild);
        }
    }

    function clearCurrentSeqContainer(){
        while (currentSeqContainer.firstChild) {
            currentSeqContainer.removeChild(currentSeqContainer.firstChild);
        }
    }














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
        // flipCardInner.classList.add('col-sm')
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
        flipCardInner.appendChild(poseCards)
        // poseCardContainer.appendChild(flipCardInner)
        // posesDiv.appendChild(poseCardContainer)


        backPoseCardSequenceInfo(flipCardInner)
        // poseCardContainer.appendChild(poseCards)
      })
    })
} //edn of createPoseCard

createPoseCard() //calling the create poseCard function


function backPoseCardSequenceInfo(flipCardInner){
  fetch("http://localhost:3000/sequences")
  .then(function(response){
    return response.json()
  })
  .then(function(json){
    json.forEach(function(sequence){
      const poseCardBack = document.createElement("div")
      poseCardBack.classList.add("flip-card-back")
      const sequenceName = document.createElement("h1")
      sequenceName.innerText = sequence.sequence_name
      poseCardBack.appendChild(sequenceName)
      const sequenceMemo = document.createElement("h2")
      sequenceMemo.innerText = "Memo: " + sequence.memo
      poseCardBack.appendChild(sequenceMemo)
      let addPoseButton = document.createElement("button")
      addPoseButton.classList.add("button")
      addPoseButton.innerText = "Add Pose"
      addPoseButton.addEventListener("click", addPoseToSequence() )
      //create a new sequence pose (id)
      //get sequence
      poseCardBack.appendChild(addPoseButton)
      flipCardInner.appendChild(poseCardBack)
      poseCardContainer.appendChild(flipCardInner)
      posesDiv.appendChild(poseCardContainer)

    })
  })

} //end of backPoseCardSequenceInfo


function addPoseToSequence(){
  //work w/ SequencePose
  // fetch("http://localhost:3000/sequence_poses", {
  //   method: "POST",
  //   headers: {  'Content-Type': 'application/json',
  //               'Accept' : 'application/json'
  //   },
  //   body: JSON.stringify(
  //
  //   )

  })




} //end of addPoseToSequence

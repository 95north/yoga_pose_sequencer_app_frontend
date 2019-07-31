
const navHeader = document.getElementById("nav-header");
const newSeqBtn = document.getElementById("new-sequence");
const viewSeqsBtn = document.getElementById("view-sequences");
const currentSeqContainer = document.getElementById("current-sequence");

const poseCardContainer = document.querySelector(".flip-card")
const posesDiv = document.querySelector(".poses-div")


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
        e.preventDefault();                         // Does NOT have to be after newSeqName, etcs

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
        clearPoseCardContainer();                       // ADD SHOW ALL CARDS AGAIN!! 
        createPoseCard() //calling the create poseCard function

        createSaveSeqBtn();
    }
    

    function createSaveSeqBtn(e){
        let seqToSave = e
        console.log("e target is: ", e)
        let saveSeqBtn = document.getElementById("save-seq")
        saveSeqBtn.style.display = "block";
        saveSeqBtn.innerText = "Save Your Sequence"
        saveSeqBtn.onclick = saveSequence;
    }


    function saveSequence(e){
        let currentSeq = currentSeqContainer.firstChild.dataset.seqid
        console.log( " currentSeq is: ", currentSeq)

        // GET ALL POSES TO SAVE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // poseIDs = array of array. [ [pose_id, order#, duration], [p,o,d].. ]
        let poseIDs = queryPoseCardSaveFlags(); // Call function
        let apiPostBody = []

        for (const pose of poseIDs) {
            apiPostBody.push({sequence_id: currentSeq, pose_id: pose[0], order_no: pose[1], duration: pose[2] })
        }    

        fetch(`http://localhost:3000/bulkcreatesp`, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify(
                apiPostBody)
        }).then( res => res.json() )
        .then( res => {
            console.log(res)
        })
    }

    function queryPoseCardSaveFlags(){
        let arrayFlaggedPoseCards = []
        // search all pose cards for dataset 
        let allPoseCards = Array.from(document.querySelectorAll(".flip-card-inner"));
        console.log("allPoseCards is: ", allPoseCards)
        for (const p of allPoseCards) {
            if (p.dataset.flag == "t") {
                console.log("line 111 TRUE, pose Id is: ", p.id)
                let tempArr = [p.id.slice(6)  , p.dataset.order_no, p.dataset.duration ];
                arrayFlaggedPoseCards.push(tempArr);
            } 
        }
        console.log("arrayFlaggedPoseCards --- ", arrayFlaggedPoseCards)
        return arrayFlaggedPoseCards;
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
       
        appendSequenceLiViewButton(sequenceLi);
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

        let nodeToDisappear = (e.target).parentElement
        nodeToDisappear.style.display = "none";
    }


    function appendSequenceLiViewButton(sequenceLi){
        // seqToView = sequenceLi.target
        // console.log("seqToView  : ", seqToView);   // UNDEFINEDs

        let spanView = document.createElement("span");
        spanView.setAttribute("id", `viewSeq${sequenceLi.dataset.seqid}`);
        spanView.setAttribute("class", "viewBtns");
        spanView.innerHTML = " ......View "; 
        spanView.onclick = viewSequence;
        sequenceLi.appendChild(spanView);  
    }
    
    
    function viewSequence(e){
        clearPoseCardContainer();
        let seqToView = e.target.id.slice(7);
        console.log("seqToView is: ", seqToView);  

        fetch(`http://localhost:3000/sp/${seqToView}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json; charset=utf-8", "Accept": 'application/json' },
            })
        .then(function(response){
            return response.json()
        })
        .then(function (sequencePoseView){
            //showPoseCardEach(sequencePoseView);  // PLACEHOLDER !!!
            playSequence(sequencePoseView);
        })
    }

    function showPoseCardEach(sequencePoseView){
        clearPoseCardContainer()
        sequencePoseView.forEach(function(sequencePose){
            const showPoseViewCard = document.createElement("div")
            showPoseViewCard.classList.add("card")
            const getPoseId = document.createElement("p")
            getPoseId.innerText = sequencePose.pose_id
            showPoseViewCard.appendChild(getPoseId)
            const getSequenceId = document.createElement("p")
            getSequenceId.innerText = sequencePose.sequence_id
            showPoseViewCard.appendChild(getSequenceId)
            const getSequenceOrderNo = document.createElement("p")
            getSequenceOrderNo.innerText = sequencePose.order_no
            showPoseViewCard.appendChild(getSequenceOrderNo)
            const getSequenceDuration = document.createElement("p")
            getSequenceDuration.innerText = sequencePose.duration
            showPoseViewCard.appendChild(getSequenceDuration)
            poseCardContainer.appendChild(showPoseViewCard)
        })

    }


    function playSequence(apiSP){
        console.log("apiSP is: ", apiSP)
        console.log("apiSP  0 is: ", apiSP[0])

        let timeCounter = 0;
        let holdTimes = [0]


        apiSP.forEach(function (pose){
            console.log(" pose.id is: ", pose.pose_id)
            holdTimes.push(pose.duration * 60 * 10)   // is 10 not 1000!!!!! 
        }) // ends apiSP.forEach

        console.log("Hold times: ", holdTimes)

        apiSP.forEach(function (pose){
            
            // if( (timeCounter) == (holdTimes.length-1)){
            //     console.log("I DDO TIHNGS")
            //     // clearPoseCardContainer();
            // }
            let durationTime = holdTimes[timeCounter];
            setTimeout(function(){ 
                createOnePoseCard(pose.pose_id);
                // clearPoseCardContainer();
             }, durationTime);

            timeCounter += 1;

            
        }) // ends apiSP.forEach

    }
    

    function createOnePoseCard(poseId){
        clearPoseCardContainer();
    
        console.log("Pose ID is: ", poseId)

        fetch(`http://localhost:3000/poses/${poseId}`)
        .then(function(response){
        return response.json()
        })
        .then(function(pose){ 
            console.log("pose is:  ", pose);

            const flipCardInner = document.createElement("div")
            flipCardInner.classList.add("flip-card-inner")
            flipCardInner.id = `poseId${pose.id}`
    
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
            poseCardContainer.appendChild(flipCardInner);
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
        flipCardInner.id = `poseId${pose.id}`
        // const poseId = document.createElement("p")
        // poseId.innerText = pose.id 
        // flipCardInner.appendChild(poseId)

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
        console.log(flipCardInner)
        // poseCardContainer.appendChild(poseCards)
      })
    })
} //edn of createPoseCard



function backPoseCardSequenceInfo(flipCardInner){
//   fetch("http://localhost:3000/sequences")
//   .then(function(response){
//     return response.json()
//   })
//   .then(function(json){
//     json.forEach(function(sequence){
//       const poseCardBack = document.createElement("div")
//       poseCardBack.classList.add("flip-card-back")
//       const sequenceName = document.createElement("h1")
//       sequenceName.innerText = sequence.sequence_name
//       poseCardBack.appendChild(sequenceName)
//       const sequenceMemo = document.createElement("h2")
//       sequenceMemo.innerText = "Memo: " + sequence.memo
//       poseCardBack.appendChild(sequenceMemo)

//       poseId = flipCardInner.id.slice(6);
//       let addPoseForm = document.createElement("button");
//     //    addPoseForm.innerHTML = `<id="flagBtn${poseId}" name="poseN" ><br>`
//         console.log(addPoseForm)
//         addPoseForm.id = `flagBtn${poseId}`
//         addPoseForm.innerText = "Add Pose to Your Sequence"
//     //   let addPoseForm = document.createElement("form");      
//     //   addPoseForm.innerHTML = `<input type="submit" id="flagBtn${poseId}" name="poseN" value = "Add Pose to Your Sequence"><br> <br>`
      
//     //   addPoseForm.value = "Add Pose to Your Sequence"  // DOES ONO WORk

//       poseCardBack.appendChild(addPoseForm)
//       flipCardInner.appendChild(poseCardBack)
//       poseCardContainer.appendChild(flipCardInner)
//       posesDiv.appendChild(poseCardContainer)
//       addPoseToSequence(poseId)
//     })
// })

    poseId = flipCardInner.id.slice(6);
    let poseCardBack = document.createElement("div");
    poseCardBack.classList.add("flip-card-back");
    poseCardBack.id = `cardBack${poseId}`;

    let addPoseForm = document.createElement("button");
    addPoseForm.id = `flagBtn${poseId}`;
    addPoseForm.innerText = "Add Pose to Your Sequence";
    
    poseCardBack.appendChild(addPoseForm);
    flipCardInner.appendChild(poseCardBack);
    poseCardContainer.appendChild(flipCardInner);
    posesDiv.appendChild(poseCardContainer);

    addPoseToSequence(poseId)
} //end of backPoseCardSequenceInfo



function addPoseToSequence(poseId){
    const flagBtn = (document.getElementById(`flagBtn${poseId}`))
    flagBtn.addEventListener("click", function(e){
        flagPose(e)
    } );
}


function flagPose(e){
    //e.preventDefault();
    let poseId = e.target.id.slice(7)
    console.log(poseId);

    addPoseForm = document.getElementById(`flagBtn${poseId}`)

    let flipCardInnerToFlag = document.getElementById(`poseId${poseId}`)
    flipCardInnerToFlag.dataset.flag = "t"
    console.log(flipCardInnerToFlag.dataset.flag);
    createFlagPoseForm(poseId)

} //end of flagPose


function createFlagPoseForm(poseId){
    let poseC = document.getElementById(`cardBack${poseId}`)
    let poseCard = poseC//.parentElement

    const buttonToDelete = document.getElementById(`flagBtn${poseId}`)
    buttonToDelete.remove()

    // while (poseCard.firstChild) {
    //   poseCard.removeChild(poseCard.firstChild);
    // }

    const formForOrderAndDuration = document.createElement("form")
    formForOrderAndDuration.innerHTML = `
    <form action="/action_page.php">
    <input type="number" name="order_no" placeholder="display pose order"><br>
    <input type="number" name="duration" placeholder= "duration of sequence"> <br>
    <input type="submit" value="Submit">
  </form>
  `
  

    formForOrderAndDuration.id = `odForm${poseId}`
  poseCard.appendChild(formForOrderAndDuration)
  
  formForOrderAndDuration.addEventListener("submit", function(e){
      getFlagPoseInfo(e, poseId)   
  })
  //after this poseId is being changed to 5 
}

function getFlagPoseInfo(e, poseId){
    e.preventDefault();
    console.log("e.tag: ",  e.target[0].value )

    let orderNo = e.target[0].value;
  let durationNo = e.target[1].value;
  let flipCardInnerToFlag = document.getElementById(`poseId${poseId}`)
  console.log("flipCardInnerToFlag is:  ", flipCardInnerToFlag)
  flipCardInnerToFlag.dataset.order_no= orderNo;
  // duration
  flipCardInnerToFlag.dataset.duration = durationNo;
  removePoseForm(poseId)
}

function removePoseForm(poseId){
    // console.log("flipCardInnerToFlag....", flipCardInnerToFlag)
    //let orderDurationForm = document.getElementById(`odForm${poseId}`);
    let formToDelete = document.getElementById(`odForm${poseId}`);
    
    addRemovePoseButton(poseId);
} //end of removePoseForm 

function addRemovePoseButton(poseId){
    let formToDelete = document.getElementById(`odForm${poseId}`);
    formToDelete.style.display = "none";

    //show order # and duration 
    const removePoseButton = document.createElement("button")
    removePoseButton.innerText = "Remove Pose From Sequence"
    removePoseButton.id = `flagBtn${poseId}`;
    formToDelete.parentElement.appendChild(removePoseButton)

    removePoseButton.addEventListener("click", function(e){
        addAddPoseButton(e, removePoseButton);
    })
}


function addAddPoseButton(e, removePoseButton){
    poseId = e.target.id.slice(7);
    console.log("e.target is: ", e.target);
    console.log("poseId is: ", poseId);

    let flipCardInnerToFlag = document.getElementById(`poseId${poseId}`)
    flipCardInnerToFlag.dataset.flag = "f"
    console.log(flipCardInnerToFlag.dataset.flag);

    let addPoseForm = document.createElement("button");
    addPoseForm.id = `flagBtn${poseId}`;
    addPoseForm.innerText = "Add Pose to Your Sequence";

    removePoseButton.remove();
    cardBackToAppendTo = document.getElementById(`cardBack${poseId}`);
    cardBackToAppendTo.appendChild(addPoseForm);
    addPoseToSequence(poseId);
}

  
  //then show order # and duration and display button to remove pose from sequence 
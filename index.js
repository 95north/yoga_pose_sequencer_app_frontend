const poseCardContainer = document.getElementById("poses-div");

const navHeader = document.getElementById("nav-header");
const newSeqBtn = document.getElementById("new-sequence");
const viewSeqsBtn = document.getElementById("view-sequences");



    newSeqBtn.addEventListener("click", function(e){
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
            createNewSequenceFetch(e)
        })
    })

    function createNewSequenceFetch(e){
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
            navHeader.appendChild(currentSeq);

        })
    }

    function clearPoseCardContainer(){
        
    }















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
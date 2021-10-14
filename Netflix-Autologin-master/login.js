'use strict';
    
    fetch('http://localhost:3000/mysubs',{
        method:'POST',
        headers:{
            "Content-type":'application/json'
        },
        body:JSON.stringify({email:chrome.storage.local.get(['email'], function(result) {
            console.log(result.email,"res");
            let temp = result.email;
            return temp;
            })
        })
    })
    .then(res => res.json())
    .then(data =>{
        console.log(data);
        if(data && data.message!=="no"){
            let email = data.email;
            let pass = data.pass;
            return {email:email,pass:pass};
        }
    })
    .then(data => {
        setTimeout(() => {

            if(data.email && data.pass){
            document.querySelectorAll(".placeLabel").forEach(lbl=>{
                lbl.style.display= "none";
            });
                setTimeout(()=>{
                    document.getElementById("id_userLoginId").focus();
                    setTimeout(()=>{
                        document.getElementById("id_userLoginId").value = data.email;
                        document.getElementById("id_userLoginId").style.display="none";
                        setTimeout(()=>{
                            document.getElementById("id_password").focus();
                            setTimeout(()=>{
                                document.getElementById("id_password").value = data.pass;
                                document.getElementById("id_password").style.display="none";
                            },1000)
                        },1000)
                    },1000)
                },1000)
            }
        }, 1000);
    })

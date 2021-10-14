$("#submit").click(function (e) { 
    e.preventDefault();
    var email = $("#emailIn").val();
    var pass =  $("#passIn").val();
    fetch('http://localhost:3000/login',{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({email:$("#emailIn").val(), password: $("#passIn").val()})

        })
        .then(res => res.json())
        .then(data => {
            if(data.message === "yes"){
                chrome.storage.local.set({email:email,pass:pass}, function() {
                   $("#form").hide();
                });
                $("#form").hide();
            }
        });
});
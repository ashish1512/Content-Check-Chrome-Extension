chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
    //console.log(request.source);
message.innerText="Done!"
    parser=new DOMParser();
    htmlDoc=parser.parseFromString(request.source, "text/html");
    text = htmlDoc.querySelectorAll('[class="_1mf _1mj"]');
    
message.innerText=text[0].innerText;
//document.getElementById('message').style.display='none';
    var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://api.meaningcloud.com/sentiment-2.1",
  "method": "POST",
  "headers": {
    "content-type": "application/x-www-form-urlencoded"
  },
  "data": {
    "key": "6faacc61e7a8e47036066ced8000ccdb",
    "lang": "en",
    "txt": text[0].innerText,
    "model": "general"
  }
}

$.ajax(settings).done(function (response) {

  console.log(response);
  if(response.score_tag=="P" || response.score_tag=="P+")
    {
        var score;
        if(response.score_tag=='P')
        score=0.7;
        else
        score=0.9;

        sentiment.innerText="positive";
        end.innerText="with a score of " + score;
    }
    else if(response.score_tag=="N" || response.score_tag=="N+"){
        var score;
        if(response.score_tag=='N')
        score=0.3;
        else
        score=0.1;

        sentiment.innerText="negative";
        document.getElementById("sentiment").className = "label label-danger";
        end.innerText="with a score of " + score;
    }
    else
    {
       var score=0.5
        sentiment.innerText="Neutral";
        document.getElementById("sentiment").className = "label label-primary";
        end.innerText="with a score of " + score; 
    }
  subjectivity1.innerText=response.subjectivity;
  irony1.innerText=response.irony;

  
});

  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
    //console.log(request.source);
message.innerText="Done!"
    parser=new DOMParser();
    htmlDoc=parser.parseFromString(request.source, "text/html");
    text = htmlDoc.querySelectorAll('[class="_1mf _1mj"]');
    
console.log(text[0].innerText);
message.innerText=text[0].innerText;
document.getElementById('message').style.display='none';
var bod={
  "documents": [
    {
      "id": "1",
      "text": text[0].innerText
    }
  ]
};
$.ajax({
            url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment",
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","68a224fd7cad44bb9e2e58a08cf56d73");
                xhrObj.setRequestHeader("Accept","application/json");
            },
            type: "POST",
            // Request body
            data: JSON.stringify(bod),
        })
        .done(function(response) {
            console.log(response.documents[0].score);
            if(response.documents[0].score>0.7)
    {
        var score=response.documents[0].score.toFixed(2);
        sentiment.innerText="positive";
        end.innerText="with a score of " + score;
    }
    else if(response.documents[0].score<0.4){
        var score=response.documents[0].score.toFixed(2);
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
            //alert("success");
        })
        .fail(function() {
            //alert("error");
        });
    
//Key Phrases
$.ajax({
            url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases",
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","68a224fd7cad44bb9e2e58a08cf56d73");
                xhrObj.setRequestHeader("Accept","application/json");
            },
            type: "POST",
            // Request body
            data: JSON.stringify(bod),
        })
        .done(function(response) {
            var a="";
            console.log(response.documents);
            response.documents.forEach(function(element) {
                console.log(response.documents[0].keyPhrases)
                a+=response.documents[0].keyPhrases+", ";
                a = a.substring(0, a.length - 1);
                a="superb season, Real Madrid, champions of Europe"
                console.log(a);
                other.innerText=a;
            }, this);
            //alert("success");
        })
        .fail(function() {
            //alert("error");
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
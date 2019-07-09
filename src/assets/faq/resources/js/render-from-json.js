var selectedLang = getUrlVars()["selectedlang"];
console.log('selected Lang', selectedLang);
$( document ).ready(function() {
    var jsonUrl;
    if(selectedLang){
        window.faqSelectedLang = selectedLang.trim();
        jsonUrl = "./resources/res/faq-" + window.faqSelectedLang + ".json"
    }else{
        jsonUrl="./resources/res/faq-en.json"
    }

    console.log(jsonUrl);
    $.getJSON(jsonUrl, function(data) {
        var html ='';
        html += '<div class="help-header">'
            +'<h4>'+data.constants.help+'</h4>'
            +'<p>'+data.constants.faqMsg+'</p>'
            +'</div>'
            +'<div class="info-msg">'
            +'<p>'+data.constants.resolveMsg+'</p>'
            +'</div>'
        $('#header').replaceWith(html);
        html='';
        $.each(data.faqs, function(key, value){
            html += '<div class="panel panel-default">'
                +'<div data-toggle="collapse" data-parent="#accordion" href="#collapse'+key+'">'
                +'<div class="panel-heading" >'
                +'<div class="panel-title">'
                +value.topic+'<img src="./resources/images/Arrow.png" class="btn-arrow">'
                +'</div>'
                +'</div>'
                +'</div>'
                +'<div id="collapse'+key+'" class="panel-collapse collapse">'
                +'<div class="panel-body">'
                +'<p>'+value.description+'</p>'
                +'</div>'
                +'<div class="panel-interact">'
                +'<p>'+data.constants.helpMsg+'</p>'
                +'<button type="button" class="btn" id = "btn-no">'+data.constants.noMsg+'</button>'
                +'<button type="button" class="btn" style="color: #008840" id = "btn-yes">'+data.constants.yesMsg+'</button>'
                +'<p class="yes-clicked" hidden="true">'+data.constants.thanksMsg+'</p>'
                +'</div>'
                +'<div class="panel-info" hidden="true">'
                +'<h6>'+data.constants.sorryMsg+'</h6>'
                +'<p>'+data.constants.knowMoreMsg+'</p>'
                +'<form action="#" id="know-more-form" class = "know-more-form"> '
                +'<textarea type="text" name="moreInfo" placeholder="'+data.constants.typeHere+'" class="input-text"  maxlength="1000"></textarea>'
                +'<input type="submit" value="'+data.constants.submitButton+'" class="submit-button">'
                +'</form>'
                +'<p class="no-clicked" hidden="true">'+data.constants.thanksMsg+'</p>'
                +'</div>'
                +'</div>'
                +'</div>'
        });
        $('#accordion').html(html);
        html='';

        html += '<div class="send-email">'
            +'<button class="report-button"><img src="./resources/images/Report.png"></span> '+data.constants.reportIssueMsg+'</button>'
            +'</div>'
        $('#send-email').replaceWith(html);
    })
});

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
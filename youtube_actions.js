function go_to_home()
    {
        document.querySelector('[title="YouTube Home"]').click();
    }
/*
function go_to_yourchannel()
{
    document.getElementById("avatar-btn").click();
    document.getElementsByClassName("yt-simple-endpoint style-scope ytd-compact-link-renderer").click();
}
*/

function search_video(s)
{
    //window.location.href = '/results?search_query=' + encodeURIComponent(s);
    document.getElementById("search").querySelector("input").value = s;
    document.getElementById("search-icon-legacy").click();
}

function ordinal_selection(num)
{
    var video_list = document.getElementsByTagName("ytd-video-renderer");
    var targetVid = video_list[num];
    targetVid.querySelector("#thumbnail").click();
}

function like_video()
{
    //var btn_list = document.getElementsByTagName("ytd-toggle-button-renderer");
    var btns = document.getElementsByClassName("style-scope ytd-menu-renderer force-icon-button")
    btns[0].click()
}

function dislike_video()
{
    var btns = document.getElementsByClassName("style-scope ytd-menu-renderer force-icon-button")
    btns[1].click()
}

function subscribe()
{
    document.querySelector("#subscribe-button > ytd-subscribe-button-renderer > paper-button").click()
}

function unsubscribe()
{
    document.querySelector("#subscribe-button > ytd-subscribe-button-renderer > paper-button").click()
    setTimeout(document.querySelector("#button").click(),2000);
}

function click_subscriptions()
{
    document.querySelector('[title="Subscriptions"]').click();
}

function open_settings()
{
    //click settings
    document.querySelector('[title="Settings"]').click();
}


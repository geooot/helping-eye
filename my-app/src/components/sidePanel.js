/* global chrome */
/* global location */
import React,{useState} from 'react'; 

export const SidePanel = () => {
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const dummy = [
        {from: "BOT", value: "Enter a command"},
    ];

    React.useEffect(_ => {
        document.onkeyup = function(e) {
            if ((e.ctrlKey || e.metaKey) && e.which == 66) {
                let elem = document.querySelector("#HelpingEye____Input");
                if (elem);
                elem.querySelector("#HelpingEye____Input").focus();
            }
        };
    }, []);
    
    const [dummyData, changeDummyData] = useState(dummy);
    const onDummyChange = (e) => changeDummyData(e.target.value);

    const bot = {
        sendMessage: (str) => {
            if (str.length <= 0)
                return;
            console.log("SEND MESSAGE FROM TRIGGER", str)
            dummyData.unshift({from: "BOT", value: str});
            forceUpdate();
        }
    }

    React.useEffect(() => {
        console.log("SETTING UP LISTENER")
        document.querySelector("#HelpingEye____Input").focus();
        chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
            console.log("onMessage", request, sender, dummyData)
            if (request.method == "newBotMessage") {
                dummyData.unshift({from: "BOT", value: request.data});
                forceUpdate();
            } else if (request.method == "evalTrigger") {
                const trigger = eval(request.data);
                console.log("THE TRIGGER", trigger)
                trigger(request.props, bot);
            }
        })
        console.log("SETUP UP LISTENER")
    }, [])

    const [sidePanel, changeSidePanel] = useState(false);
    const togglePanel = () => changeSidePanel(!sidePanel);
    
    const [userData, changeUserData] = useState('');
    const onChangeUserData = (e) => changeUserData(e.target.value);

    const [userResponse, changeUserResponse] = useState('');
    const onChangeUserResponse = (e) => changeUserResponse(e.target.value);


    const submit = () => {
        changeUserData('');
        dummyData.unshift({from: "HUMAN", value: userData});
        forceUpdate();
        chrome.runtime.sendMessage({method: "newHumanMessage", data: {message: userData, host: window.location.host}})
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        submit();
    }
    
    return (
            <div id="sidebar" style={{width: "350px", zIndex: "9999", background: "#f3f3f3", position: "fixed", top: "0", left: "0", fontFamily: "arial", boxShadow: "4px 0px 16px rgba(0,0,0,0.2)", height: "100vh", display: 'flex', flexDirection: 'column'}}>
                <div className="form-row">
                    <div className="sidebar-header col" id="header" style={{textAlign: "center", color: "#F2F7F2"}}>
                        <h2 style={{fontSize: "24px", lineHeight: "1.5", color: "#333", paddingTop: "10px"}}>Helping Eye</h2>
                    </div>
                    <button type="button" className="close col-1" aria-label="Close" onClick={togglePanel()} style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div style={{flex: 1, display: "flex", flexDirection: "column-reverse", overflow: "auto"}}>
                    { dummyData.map((item, i) => (
                        <div key={i} style={{padding: "15px 5px 15px 5px", display: "flex", flexDirection: (item["from"] === "BOT" ? "row" : "row-reverse")}}>
                            <div id={i == dummyData.length - 1 ? ("HelpingEye____LastBubble") : null} style={{padding: "10px 15px", background: (item["from"] === "BOT" ? "#ddd" : "blue"), color: (item["from"] === "BOT" ? "#333" : "white"), fontSize: "16px", maxWidth: "250px", borderRadius: "15px"}}>
                                {item["value"]}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={onFormSubmit} id="text-box" method="POST" action="#" style={{display: "flex", flexDirection: "row", justifyContent: "stretch", alignItems: "stretch"}}>
                    <input onChange={onChangeUserData} id="HelpingEye____Input" value={userData} type="text" placeholder="Enter a command" style={{flex: "1", background: "#fff", padding: "15px", color: "#333", fontSize: "20px"}}/>
                    <button type="submit" style={{textDecoration: "initial", padding: "15px", background: "#8d8dff", color: "white", letterSpacing: "initial", textTransform: "none", boxShadow: "none", borderRadius: "0", fontSize: "20px", lineHeight: "1", height: "auto"}}>Send</button>
                </form>
            </div>
    );
    
}


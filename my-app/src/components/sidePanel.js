import React,{useState} from 'react'; 

export const SidePanel = () => {

    var counter = 0;

    const dummy = [
        {from: "BOT", value: "hello my name is Anikait"},
        {from: "HUMAN", value: "hello my name is George"},
        {from: "BOT", value: "hello my name is Jon"},
        {from: "HUMAN", value: "hello my name is Aditya"},
    ];

    const [userData, changeUserData] = useState('');
    const onChangeUserData = (e) => changeUserData(e.target.value);

    const [userResponse, changeUserResponse] = useState('');
    const onChangeUserResponse = (e) => changeUserResponse(e.target.value);



    const submit = () => {
        console.log(userData);
        changeUserData('');
        counter++;
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        submit();
    }
    
    return (
            <div id="sidebar" style={{width: "350px", zIndex: "9999", background: "#f3f3f3", position: "fixed", top: "0", left: "0", fontFamily: "arial", boxShadow: "4px 0px 16px rgba(0,0,0,0.2)", height: "100vh", display: 'flex', flexDirection: 'column'}}>
                <div className="sidebar-header" id="header" style={{textAlign: "center", color: "#F2F7F2"}}>
                    <h2 style={{fontSize: "24px", lineHeight: "1.5", color: "#333", paddingTop: "10px"}}>Helping Eye</h2>
                </div>
                <div style={{flex: 1, display: "flex", flexDirection: "column-reverse"}}>
                    { dummy.map(item => (
                        <div style={{padding: "15px 5px 15px 5px", display: "flex", flexDirection: (item["from"] === "BOT" ? "row" : "row-reverse")}}>
                            <div style={{padding: "10px 15px", background: (item["from"] === "BOT" ? "#ddd" : "blue"), color: (item["from"] === "BOT" ? "#333" : "white"), fontSize: "16px", maxWidth: "250px", borderRadius: "15px"}}>
                                {item["value"]}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={onFormSubmit} id="text-box" method="POST" action="#" style={{display: "flex", flexDirection: "row", justifyContent: "stretch", alignItems: "stretch"}}>
                    <input onChange={onChangeUserData} value={userData} type="text" placeholder="Enter a command" style={{flex: "1", background: "#fff", padding: "15px", color: "#333", fontSize: "20px"}}/>
                    <button type="submit" style={{textDecoration: "initial", padding: "15px", background: "#8d8dff", color: "white", letterSpacing: "initial", textTransform: "none", boxShadow: "none", borderRadius: "0", fontSize: "20px", lineHeight: "1", height: "auto"}}>Send</button>
                </form>
            </div>
    );
    
}


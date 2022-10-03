import React from "react"

class WelcomeTour extends React.Component
{
    constructor(props){
        super(props)

        this.state = {"Welcome":true,"InstituteConf":false,"InstituteName":"","InstituteSubtitle":"","isSubtitle":false}
    }

    componentDidMount(){

    }

    render()
    {
        return(
        <div className="App">
            {this.state.Welcome && <div className="flex flex-col items-start justify-center w-screen h-screen" >
                <h1 className="text-4xl text-white
                translate-x-2/4">Welcome </h1>
                <button className="Button animate-bounce
                 text-primary bg-white w-[100px] 
                 shadow-xl absolute bottom-5 right-6" 
                 onClick={()=>{
                    this.setState({"InstituteConf":true,"Welcome":false})
                 }}>Start</button>
            </div>}
            {this.state.InstituteConf && <div className="flex flex-col gap-3 items-center justify-center w-screen h-screen bg-white text-primary">

                    <h1 className="absolute top-10 text-2xl ">Institute Configuration</h1>

                    <input type="text" className="TextBox" value={this.state.InstituteName}
                    onChange={(event)=>{
                        this.setState({"InstituteName":event.target.value})
                    }} placeholder="Institute Name"/>

                    <div>
                        <input type="checkbox" id="isSubtitle" 
                            onChange={(event)=>{
                                this.setState({"isSubtitle":!this.state.isSubtitle})
                            }} />
                    <label for="isSubtitle" className="ml-2">Do you want to provide Subtitle?</label></div>
                    
                    { this.state.isSubtitle && <input type="text" className="TextBox" value={this.state.InstituteSubtitle}
                    onChange={(event)=>{
                        this.setState({"InstituteSubtitle":event.target.value})
                    }} placeholder="Institute Subtitle"/>}

                    <button className="Button w-[100px]
                 shadow-xl absolute bottom-5 right-6" 
                 onClick={()=>{
                    window.api.setInstituteMetaData({
                            "InstituteName" : this.state.InstituteName,
                            "isTourTaken": this.state.InstituteName !== "" ? true : false,
                            "isSubtitle":this.state.isSubtitle,
                            "InstituteSubtitle":this.state.InstituteSubtitle
                    })
                    
                 }}>Submit</button>
            </div>}
        </div>)
    }
}

export default WelcomeTour
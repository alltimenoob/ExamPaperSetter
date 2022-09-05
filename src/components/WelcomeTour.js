import React from "react"

class WelcomeTour extends React.Component
{
    constructor(props){
        super(props)

        this.state = {"Welcome":true,"CollegeConf":false,"CollegeName":"","CollegeSubtitle":"","isSubtitle":false}
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
                    this.setState({"CollegeConf":true,"Welcome":false})
                 }}>Start</button>
            </div>}
            {this.state.CollegeConf && <div className="flex flex-col gap-3 items-center justify-center w-screen h-screen bg-white text-primary">

                    <h1 className="absolute top-10 text-2xl ">College Configuration</h1>

                    <input type="text" className="TextBox" value={this.state.CollegeName}
                    onChange={(event)=>{
                        this.setState({"CollegeName":event.target.value})
                    }} placeholder="College Name"/>

                    <div>
                        <input type="checkbox" id="isSubtitle" 
                            onChange={(event)=>{
                                this.setState({"isSubtitle":!this.state.isSubtitle})
                            }} />
                    <label for="isSubtitle" className="ml-2">Do you want to provide Subtitle?</label></div>
                    
                    { this.state.isSubtitle && <input type="text" className="TextBox" value={this.state.CollegeSubtitle}
                    onChange={(event)=>{
                        this.setState({"CollegeSubtitle":event.target.value})
                    }} placeholder="College Subtitle"/>}

                    <button className="Button w-[100px]
                 shadow-xl absolute bottom-5 right-6" 
                 onClick={()=>{
                    //API Call
                 }}>Submit</button>
            </div>}
        </div>)
    }
}

export default WelcomeTour
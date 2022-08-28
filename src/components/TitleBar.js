import '../App.css';

function TitleBar(props)
{
    return(
    <div className="TitleBar">

        <span>{props.name}</span>
        {/* Frame Name */}

        <div className="flex">  {/* Minimize Maximize Close Icons */}
            <props.min className='TitleBarIcons' onClick={
                ()=>{
                    window.api.minimize() /* API Call To Minimize The Window */
                }
            }/>
            <props.max className='TitleBarIcons' onClick={
                ()=>{
                    window.api.maximize() /* API Call To Maximize The Window */
                }
            }/>
            <props.close className='TitleBarIcons' onClick={
                ()=>{
                    window.api.close() /* API Call To Close The Window */
                }
            }/>
        </div>
        

    </div>)
}



export default TitleBar;
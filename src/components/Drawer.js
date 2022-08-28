import { useState } from "react";

function Drawer(props)
{
    const [checked,setChecked] = useState(props.items[1].name)

    var navigators = [],drawers = [];

    for(let i = 0; i < props.items.length; i++)
    {
        const navelmnt = { element : props.items[i]}
        const draelmnt = { element : props.drawers[i]}

        navigators[i] = <navelmnt.element key={navelmnt.element.name} 
            className={navelmnt.element.name === checked ? "DrawerItem DrawerItemSelected ": "DrawerItem" } 
            onClick={()=>setChecked(navelmnt.element.name)} />

        drawers[i] = <div key={navelmnt.element.name} 
            className={navelmnt.element.name === checked ? "block" : "hidden"}>
            {draelmnt.element}</div> 
    }

    return(
        <div className="min-h-screen min-w-full flex">
            <div className="Drawer">
                {navigators}
            </div>
            <div className="min-h-screen min-w-max w-screen mt-10 bg-gray-100" >
                {drawers}
            </div>
        </div>
    )
}

export default Drawer;
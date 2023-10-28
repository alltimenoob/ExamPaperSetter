
import { AiFillPlusCircle } from "react-icons/ai"
function UnitList(props) {
    const list = props.list

    if (list === null) return <div>Loading ... 🙏</div>

    return (
        <div className="grid grid-flow-row auto-rows-min  h-full w-full overflow-scroll gap-1"
            onClick={() => props.onContextMenu({ x: 0, y: 0, id: null })}>
            {list.map((value, i) => {
                return (
                    <UnitCard
                        key={i}
                        id={value.unit_id}
                        data={value}
                        onChange={props.onChange}
                        onContextMenu={(event) => {
                            var x, y = 0;
                            if (event.pageX + 120 > window.innerWidth) {
                                x = event.pageX - 120
                            }
                            else {
                                x = event.pageX
                            }

                            y = event.pageY

                            props.onContextMenu({ x: x, y: y, id: parseInt(event.currentTarget.id) });
                        }} />)
            })}
            <div className="w-full flex items-center justify-center">
                <AiFillPlusCircle className="text-primary w-full self-center"
                    onClick={() => {
                        props.onUnitAdd()
                    }} />
            </div>
        </div>)

}

function UnitCard(props) {

    return (<input type="text"
        className='relative TextBox mb-2 w-full'
        id={props.data.unit_id}
        value={props.data.unit_name}
        onContextMenu={props.onContextMenu}
        onChange={(event) => props.onChange(event)}
        placeholder={`Course Outcome ${props.id + 1}`} />)
}

export { UnitList } 
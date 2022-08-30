
function ContextMenu(props)
{
    
    return(
        props.y !== 0 && props.x !== 0 && <ul style={{"top": props.y+"px","left": props.x+"px"}}
            className="absolute z-100 border-2 w-[120px] bg-white transition-all">
			{props.items}
		</ul>
    )
}

export default ContextMenu
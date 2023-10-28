function ContextMenu(props) {
  return (
    props.y !== 0 &&
    props.x !== 0 && (
      <ul
        style={{ top: props.y + "px", left: props.x + "px" }}
        className="fixed z-[200] border-2 w-[120px] bg-white transition-all"
      >
        {console.log("Haha")}
        {props.items}
      </ul>
    )
  );
}

export default ContextMenu;

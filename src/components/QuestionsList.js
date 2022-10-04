import QuestionCard from "./QuestionCard";

export default function QuestionsList(props) {
  if (props.list === (null || undefined)) return <p>List Loading</p>;

  return (
    <div className="m-5 grid grid-flow-row auto-rows-min h-full w-full overflow-scroll gap-1">
      {props.list.map((value, i) => {
        return <QuestionCard key={i} data={value} />;
      })}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */

// import DndContainer from "./components/dnd/dnd-container";
import Calendar from "./components/big_calendar/calendar";
import NormalCalendar from "./components/big_calendar/normal-calendar";

function App() {
  return (
    <div className='w-screen h-screen p-20'>
      {/* <DndContainer /> */}

      {/* <NormalCalendar /> */}

      <Calendar />
    </div>
  );
}

export default App;

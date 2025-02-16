/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import moment from "moment";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { Event, momentLocalizer, View } from "react-big-calendar";

import Calendar from "./calendar";

const localizer = momentLocalizer(moment);

interface MyEvent extends Event {
  id: number;
}

const EVENTS: MyEvent[] = [
  {
    start: moment("2025-02-18T10:00:00").toDate(),
    end: moment("2025-02-18T11:00:00").toDate(),
    title: "MRI Registration",
    resource: {
      type: "emergency",
    },
    id: 1,
  },
  {
    start: moment("2025-02-18T14:00:00").toDate(),
    end: moment("2025-02-18T15:30:00").toDate(),
    title: "ENT Appointment",
    // allDay: true,
    resource: {
      type: "meeting",
    },
    id: 2,
  },
];

const DnDCalendar = withDragAndDrop(Calendar);

const NormalCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");
  const [events, setEvents] = useState<MyEvent[]>(EVENTS);

  const handleEventDrop = (args: EventInteractionArgs<Event>) => {
    console.log(args);
  };

  return (
    <div className='w-screen h-screen p-10'>
      <DnDCalendar
        key={"hello"}
        startAccessor='start'
        endAccessor='end'
        date={date}
        view={view}
        events={events}
        localizer={localizer}
        selectable
        onNavigate={(newDate) => setDate(newDate)}
        onView={(newView) => setView(newView)}
        timeslots={4}
        step={15}
        onEventDrop={handleEventDrop}
        // onSelectSlot={(e) => {
        //   console.log(e);
        // }}
        draggableAccessor={(event) => {
          console.log("draggableAccessor", event);
          return true;
        }}
        resizableAccessor={(event) => {
          console.log("resizableAccessor", event);
          return true;
        }}
        // resizable
        popup
      />
    </div>
  );
};

export default NormalCalendar;

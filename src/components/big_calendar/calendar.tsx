import { useState } from "react";
import {
  Calendar as BigCalendar,
  Event,
  momentLocalizer,
  View,
} from "react-big-calendar";
import moment from "moment";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";

import { CustomEvent, CustomToolbar, eventStyleGetter } from "./customs";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);

export interface MyEvent extends Event {
  id: number;
  resource: {
    type: string;
  };
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

const DnDCalendar = withDragAndDrop<MyEvent>(BigCalendar);

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");
  const [events, setEvents] = useState<MyEvent[]>(EVENTS);

  const handleEventDrop = (args: EventInteractionArgs<MyEvent>) => {
    const { start, end, event } = args;

    const isSameDate = events.some(
      (item) => item.start === start && item.end === end
    );

    if (!isSameDate) {
      setEvents((prev) =>
        prev.map((item) =>
          item.id === event.id
            ? { ...item, start: start as Date, end: end as Date }
            : item
        )
      );
    }
  };

  return (
    <DnDCalendar
      key={"dnd_calendar"}
      defaultDate={new Date()}
      defaultView='month'
      localizer={localizer}
      eventPropGetter={eventStyleGetter}
      components={{
        toolbar: CustomToolbar,
        event: CustomEvent,
      }}
      startAccessor={(event) => event.start as Date}
      endAccessor={(event) => event.end as Date}
      date={date}
      view={view}
      events={events}
      selectable
      onNavigate={(newDate) => setDate(newDate)}
      onView={(newView) => setView(newView)}
      timeslots={4}
      step={15}
      onEventDrop={handleEventDrop}
      // onSelectSlot={(e) => {
      //   console.log(e);
      // }}
      draggableAccessor={() => {
        // console.log("draggableAccessor", event);
        return true;
      }}
      resizableAccessor={() => {
        // console.log("resizableAccessor", event);
        return false;
      }}
      resizable
      popup
    />
  );
};

export default Calendar;

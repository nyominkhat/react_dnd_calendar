/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useState } from "react";
import {
  Calendar as BigCalendar,
  Event,
  momentLocalizer,
  SlotInfo,
  View,
} from "react-big-calendar";
import moment from "moment";
import withDragAndDrop, {
  DragFromOutsideItemArgs,
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";

import {
  CustomEvent,
  CustomToolbar,
  EventFormModal,
  eventStyleGetter,
} from "./customs";

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
    allDay: true,
    resource: {
      type: "meeting",
    },
    id: 2,
  },
  {
    start: moment("2025-02-18T15:00:00").toDate(),
    end: moment("2025-02-18T19:30:00").toDate(),
    title: "TCN Blah Blah",
    allDay: true,
    resource: {
      type: "meeting",
    },
    id: 3,
  },
];

const DnDCalendar = withDragAndDrop<MyEvent>(BigCalendar);

type MODAL = "create" | "edit" | "delete";

const Calendar = () => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  const [openModal, setOpenModal] = useState<{
    open: boolean;
    type?: MODAL;
    info?: SlotInfo;
    event?: MyEvent;
  }>({
    open: false,
    type: undefined,
    info: undefined,
    event: undefined,
  });

  const [popupDraggedEvent, setPopupDraggedEvent] = useState<
    MyEvent | undefined
  >(undefined);
  const [events, setEvents] = useState<MyEvent[]>(EVENTS);

  const handleEventDrop = useCallback((args: EventInteractionArgs<MyEvent>) => {
    const { start, end, event, isAllDay } = args;

    setEvents((prev) =>
      prev.map((item) =>
        item.id === event.id
          ? {
              ...item,
              start: start as Date,
              end: end as Date,
              allDay: isAllDay,
            }
          : item
      )
    );
  }, []);

  const handleEventResize = useCallback(
    (args: EventInteractionArgs<MyEvent>) => {
      const { start, end, event } = args;

      setEvents((prev) =>
        prev.map((item) =>
          item.id === event.id
            ? { ...item, start: start as Date, end: end as Date }
            : item
        )
      );
    },
    []
  );

  const handleSelectSlot = useCallback((info: SlotInfo) => {
    setOpenModal((prev) => ({ ...prev, open: true, info, type: "create" }));
  }, []);

  const handleDropFromOutside = useCallback(
    (args: DragFromOutsideItemArgs) => {
      console.log("handleDropFromOutsite", args);
      const { allDay, end, start } = args;

      if (popupDraggedEvent) {
        setEvents((prev) =>
          prev.map((item) =>
            item.id === popupDraggedEvent.id
              ? { ...item, start: start as Date, end: end as Date, allDay }
              : item
          )
        );

        setPopupDraggedEvent(undefined);
      }
    },
    [popupDraggedEvent]
  );

  const handleSaveEvent = (title: string) => {
    if (openModal.info) {
      const newId =
        events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
      const newEvent: MyEvent = {
        id: newId,
        title,
        start: openModal.info.start,
        end: openModal.info.end,
        resource: { type: "meeting" },
      };
      setEvents([...events, newEvent]);
      setOpenModal({ open: false });
    }

    if (openModal.event) {
      setEvents((prev) =>
        prev.map((item) =>
          item.id === openModal.event?.id ? { ...item, title } : item
        )
      );
      setOpenModal({ open: false });
    }
  };

  const handleSelectEvent = useCallback((event: MyEvent) => {
    setOpenModal((prev) => ({
      ...prev,
      open: true,
      type: "edit",
      info: undefined,
      event,
    }));
  }, []);

  return (
    <>
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
        onEventResize={handleEventResize}
        onSelectSlot={handleSelectSlot}
        handleDragStart={(e) => {
          setPopupDraggedEvent(e);
        }}
        onSelectEvent={handleSelectEvent}
        draggableAccessor={() => {
          // console.log("draggableAccessor", event);
          return true;
        }}
        resizableAccessor={() => {
          // console.log("resizableAccessor", event);
          return true;
        }}
        onDropFromOutside={handleDropFromOutside}
        resizable
        popup
      />

      <EventFormModal
        open={openModal.open}
        type={openModal.type}
        event={openModal.event}
        onClose={() => setOpenModal((prev) => ({ ...prev, open: false }))}
        onSave={handleSaveEvent}
      />
    </>
  );
};

export default Calendar;

/* eslint-disable react-refresh/only-export-components */
import {
  Event,
  EventProps,
  NavigateAction,
  ToolbarProps,
  View,
} from "react-big-calendar";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import type { MyEvent } from "./calendar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";

export const eventStyleGetter = (event: Event) => {
  // console.log("eventStyleGetter", event);

  const backgroundColor =
    event.resource?.type === "meeting" ? "#3174ad" : "#e02e1e";

  return {
    style: {
      backgroundColor,
      borderRadius: "5px",
      opacity: 0.8,
      color: "white",
      border: "10px",
      display: "block",
    },
  };
};

export const CustomToolbar = (toolbar: ToolbarProps<MyEvent, object>) => {
  // console.log("toolbar", toolbar);

  const NAVIGATES: NavigateAction[] = ["TODAY", "PREV", "NEXT"];

  const onNavigate = (navigate: NavigateAction) => {
    toolbar.onNavigate(navigate);
  };

  const onView = (view: View) => {
    toolbar.onView(view);
  };

  return (
    <div className='mb-2.5 flex items-center justify-between'>
      <div className='flex divide-x'>
        {NAVIGATES.map((navigate) => (
          <Button
            key={navigate}
            onClick={() => onNavigate(navigate)}
            className='first:rounded-l-md cursor-pointer rounded-none last:rounded-r-md'
          >
            {navigate.slice(0, 1) + navigate.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      <div>
        <p className='text-sm font-semibold'>{toolbar.label}</p>
      </div>

      <div className='flex divide-x'>
        {(toolbar.views as View[]).map((item: View) => (
          <Button
            key={item}
            onClick={() => onView(item)}
            className='first:rounded-l-md cursor-pointer rounded-none last:rounded-r-md'
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export const CustomEvent = (props: EventProps) => {
  // console.log("event", props);

  return (
    <div>
      <h4 className='text-sm font-semibold'>{props.event.title}</h4>

      <p className='text-xs text-gray-400'>
        {props.event?.start?.toLocaleTimeString()} -{" "}
        {props.event?.end?.toLocaleTimeString()}
      </p>
    </div>
  );
};

type EventFormModalProps = {
  open: boolean;
  onClose: () => void;
  type?: "create" | "edit" | "delete";
  onSave: (title: string) => void;
  event?: MyEvent;
};

export const EventFormModal = ({
  open,
  onClose,
  type,
  onSave,
  event,
}: EventFormModalProps) => {
  const [title, setTitle] = useState("");

  // Reset title when modal opens
  useEffect(() => {
    setTitle(event?.title as string);
  }, [event, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title);
    }
  };

  const handleClose = () => {
    onClose();
    setTitle("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "Create Event" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='title' className='text-right'>
                Title
              </Label>
              <Input
                defaultValue={event?.title as string}
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Save Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

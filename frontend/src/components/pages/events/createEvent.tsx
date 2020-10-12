import { CREATE_EVENT } from "@graphql/events/mutations";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Event } from "@interfaces/events";

const CreateEvent = () => {
    const defaultInput = {
        title: "",
        description: "",
        starttime: "",
        endtime: "",
        location: "",
        organizationId: "",
        categoryId: "",
        image: "",
        isAttendable: "",
        deadline: "",
        publisher: "",
    };

    const [eventData, setEventData] = useState(defaultInput);

    const [createEvent] = useMutation<{ createEvent: { event: Event } }>(CREATE_EVENT, {
        update: (cache, { data }) => {
            data &&
                cache.modify({
                    fields: {
                        allEvents: (existingEvents) => {
                            const newEventRef = cache.writeFragment<Event>({
                                data: data.createEvent.event,
                                fragment: gql`
                                    fragment NewEvent on Event {
                                        id
                                    }
                                `,
                            });
                            return [...existingEvents, newEventRef];
                        },
                    },
                });
        },
    });

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log(eventData);
                    createEvent({
                        variables: {
                            title: eventData.title,
                            description: eventData.description,
                            starttime: eventData.starttime,
                            endtime: eventData.endtime,
                            location: eventData.location,
                            organizationId: parseInt(eventData.organizationId),
                            categoryId: parseInt(eventData.categoryId),
                            image: eventData.image,
                            isAttendable: eventData.isAttendable,
                            deadline: eventData.deadline,
                            publisher: eventData.publisher,
                        },
                    });
                    setEventData(defaultInput);
                }}
            >
                <div>
                    <input
                        placeholder="Title"
                        value={eventData.title}
                        onChange={(e) => setEventData({ ...eventData, title: e.currentTarget.value })}
                    />
                </div>
                <div>
                    <input
                        placeholder="Description"
                        value={eventData.description}
                        onChange={(e) => setEventData({ ...eventData, description: e.currentTarget.value })}
                    />
                </div>
                <div>
                    Start time: &nbsp;
                    <input
                        type="datetime-local"
                        placeholder="Start time"
                        value={eventData.starttime}
                        onChange={(e) => setEventData({ ...eventData, starttime: e.currentTarget.value })}
                    />
                </div>
                <div>
                    End time: &nbsp;
                    <input
                        type="datetime-local"
                        placeholder="End time"
                        value={eventData.endtime}
                        onChange={(e) => setEventData({ ...eventData, endtime: e.currentTarget.value })}
                    />
                </div>
                <div>
                    <input
                        placeholder="Location"
                        value={eventData.location}
                        onChange={(e) => setEventData({ ...eventData, location: e.currentTarget.value })}
                    />
                </div>
                <div>
                    <input
                        placeholder="Organization ID"
                        value={eventData.organizationId}
                        onChange={(e) => setEventData({ ...eventData, organizationId: e.currentTarget.value })}
                    />
                </div>
                <div>
                    <input
                        placeholder="Category ID"
                        value={eventData.categoryId}
                        onChange={(e) => setEventData({ ...eventData, categoryId: e.currentTarget.value })}
                    />
                </div>
                <div>
                    <input
                        placeholder="Image"
                        value={eventData.image}
                        onChange={(e) => setEventData({ ...eventData, image: e.currentTarget.value })}
                    />
                </div>
                <div>
                    Is attendable: &nbsp;
                    <input
                        type="checkbox"
                        placeholder="Is attendable"
                        value={eventData.isAttendable}
                        onChange={(e) => setEventData({ ...eventData, isAttendable: e.currentTarget.value })}
                    />
                </div>
                <div>
                    Deadline: &nbsp;
                    <input
                        type="datetime-local"
                        placeholder="Deadline"
                        value={eventData.deadline}
                        onChange={(e) => setEventData({ ...eventData, deadline: e.currentTarget.value })}
                    />
                </div>
                <div>
                    <input
                        placeholder="Publisher"
                        value={eventData.publisher}
                        onChange={(e) => setEventData({ ...eventData, publisher: e.currentTarget.value })}
                    />
                </div>
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;

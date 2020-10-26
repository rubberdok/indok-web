import { CREATE_EVENT } from "@graphql/events/mutations";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Event } from "@interfaces/events";
import Button from "@components/ui/Button";

const CreateEvent = () => {
    const defaultInput = {
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        organizationId: "",
        categoryId: "",
        image: "",
        isAttendable: false,
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
                id="createform"
                onSubmit={(e) => {
                    e.preventDefault();
                    const filtered = Object.entries(eventData).filter(([k, v]) => v !== "");
                    const filteredObj = Object.fromEntries(filtered);
                    createEvent({ variables: { ...filteredObj } }).then((res) => setEventData(defaultInput));
                }}
            >
                <h2 style={{ marginTop: -10, marginBottom: 10, textAlign: "center" }}>Create new event</h2>
                <h4 style={{ margin: 0 }}>Mandatory fields</h4>
                <div>
                    Title: &nbsp;
                    <input
                        placeholder="Title"
                        value={eventData.title}
                        onChange={(e) => setEventData({ ...eventData, title: e.currentTarget.value })}
                    />
                </div>
                <div>
                    Publisher: &nbsp;
                    <input
                        placeholder="Publisher"
                        value={eventData.publisher}
                        onChange={(e) => setEventData({ ...eventData, publisher: e.currentTarget.value })}
                    />
                </div>
                <div>
                    Start time: &nbsp;
                    <input
                        type="datetime-local"
                        placeholder="Start time"
                        value={eventData.startTime}
                        onChange={(e) => setEventData({ ...eventData, startTime: e.currentTarget.value })}
                    />
                </div>
                <div>
                    Is attendable: &nbsp;
                    <input
                        type="checkbox"
                        placeholder="Is attendable"
                        checked={eventData.isAttendable}
                        onChange={(e) => setEventData({ ...eventData, isAttendable: e.currentTarget.checked })}
                    />
                </div>
                <div>
                    Description: <br />
                    <textarea
                        style={{
                            width: 300,
                            height: 60,
                        }}
                        form="createform"
                        placeholder="Description ..."
                        value={eventData.description}
                        onChange={(e) => setEventData({ ...eventData, description: e.currentTarget.value })}
                    ></textarea>
                </div>

                <h4 style={{ marginBottom: 0 }}>Optional fields</h4>
                <div>
                    End time: &nbsp;
                    <input
                        type="datetime-local"
                        placeholder="End time"
                        value={eventData.endTime}
                        onChange={(e) => setEventData({ ...eventData, endTime: e.currentTarget.value })}
                    />
                </div>
                <div>
                    Location: &nbsp;
                    <input
                        placeholder="Location"
                        value={eventData.location}
                        onChange={(e) => setEventData({ ...eventData, location: e.currentTarget.value })}
                    />
                </div>
                <div>
                    Organization (ID): &nbsp;
                    <input
                        placeholder="Organization ID"
                        value={eventData.organizationId}
                        onChange={(e) => setEventData({ ...eventData, organizationId: e.currentTarget.value })}
                    />
                </div>
                <div>
                    Category (ID): &nbsp;
                    <input
                        placeholder="Category ID"
                        value={eventData.categoryId}
                        onChange={(e) => setEventData({ ...eventData, categoryId: e.currentTarget.value })}
                    />
                </div>
                <div>
                    Image (URL): &nbsp;
                    <input
                        placeholder="Image URL"
                        value={eventData.image}
                        onChange={(e) => setEventData({ ...eventData, image: e.currentTarget.value })}
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
                <button
                    style={{
                        marginTop: 20,
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginBottom: 10,
                        borderRadius: "0.5em",
                        width: 150,
                        height: 60,
                        display: "block",
                        borderColor: "#065A5A",
                        backgroundColor: "#6A9997",
                        color: "#fff",
                    }}
                    type="submit"
                >
                    Create Event
                </button>

                <Button type="submit" url="/events">
                    Create event
                </Button>
            </form>
        </div>
    );
};

export default CreateEvent;
